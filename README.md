# WAU Business Assistant — Backend

AI-powered WhatsApp-first business recordkeeping and reporting platform for farmers and agricultural businesses.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Webhook API Flow](#webhook-api-flow)
- [Meta WhatsApp Cloud API Setup](#meta-whatsapp-cloud-api-setup)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)
- [Adding New Modules](#adding-new-modules)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure the following are installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 20.x | Runtime |
| npm | >= 10.x | Package manager |
| MySQL | >= 8.x | Database |

---

## Initial Setup

```bash
# 1. Clone and navigate to project
cd /path/to/chatapp/wau-backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your credentials (see section below)
nano .env

# 5. Create MySQL database
mysql -u root -e "CREATE DATABASE wau_business CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 6. Run database migrations
npm run migrate

# 7. Seed default admin user (username: admin, password: Welcome@123)
npm run seed

# 8. Start development server
npm run dev
```

The server will start on `http://localhost:3344`.

---

## Environment Configuration

Edit `.env` with your actual values:

```bash
NODE_ENV=development
PORT=3344

# ─── WhatsApp Cloud API ───────────────────────────────────
WHATSAPP_TOKEN=<your_meta_access_token>
WHATSAPP_PHONE_NUMBER_ID=<your_phone_number_id>
WHATSAPP_VERIFY_TOKEN=<any_secret_string_you_choose>
WHATSAPP_TEST_MODE=false
WHATSAPP_API_VERSION=v22.0

# ─── Database (MySQL) ─────────────────────────────────────
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=<your_mysql_user>
DB_PASSWORD=<your_mysql_password>
DB_NAME=wau_business

# ─── AI Provider (optional for MVP) ──────────────────────
AI_PROVIDER=none

# ─── Admin API ────────────────────────────────────────────
ADMIN_API_KEY=<generate_a_strong_random_key>
```

### Where to get WhatsApp credentials:

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Navigate to your App → WhatsApp → API Setup
3. Copy **Temporary Access Token** → `WHATSAPP_TOKEN`
4. Copy **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
5. Set any string as `WHATSAPP_VERIFY_TOKEN` (you'll use this when subscribing the webhook)

---

## Database Setup

### MySQL

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE wau_business CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create user (optional)
mysql -u root -p -e "CREATE USER 'wau_user'@'localhost' IDENTIFIED BY 'your_password'; GRANT ALL ON wau_business.* TO 'wau_user'@'localhost'; FLUSH PRIVILEGES;"

# Run migrations (creates all tables)
npm run migrate

# Seed default admin (username: admin, password: Welcome@123)
npm run seed

# Rollback if needed
npm run migrate:rollback
```

### Tables Created

| Table | Purpose |
|-------|---------|
| `users` | User profiles (identified by phone number, `id` used as FK everywhere) |
| `sessions` | Conversation state per user (`user_id` FK) |
| `transactions` | Income and expense records with `type` enum (`income`/`expense`), `user_id` FK |
| `media_captures` | Voice/image uploads and AI analysis (`user_id` FK) |
| `subscriptions` | User plan and payment tracking (`user_id` FK) |
| `audit_log` | All actions for traceability (`user_id` FK) |
| `admins` | Admin users for dashboard login (username/password with bcrypt) |

> **Note:** Phone number is stored only in the `users` table. All other tables reference `users.id` via `user_id` foreign key.

---

## Running the Application

```bash
# Development (hot-reload)
npm run dev

# Production build (default → dist/)
npm run build
npm start

# Environment-specific builds
npm run build:sit    # → dist-sit/
npm run build:uat    # → dist-uat/
npm run build:live   # → dist-live/

# Start with environment-specific config
npm run start:sit    # loads .env.sit → runs dist-sit/
npm run start:uat    # loads .env.uat → runs dist-uat/
npm run start:live   # loads .env.live → runs dist-live/

# Type-check without emitting
npx tsc --noEmit
```

---

## Webhook API Flow

### Overview

```
┌──────────┐       ┌───────────────┐       ┌──────────────────┐
│  WhatsApp │──────▶│  Meta Cloud   │──────▶│  WAU Backend     │
│  User     │◀──────│  API          │◀──────│  /webhook        │
└──────────┘       └───────────────┘       └──────────────────┘
```

---

### 1. Webhook Verification (One-time setup)

When you register your webhook URL in Meta Dashboard, Meta sends a GET request to verify ownership.

```
GET /webhook?hub.mode=subscribe&hub.verify_token=<your_token>&hub.challenge=<challenge>
```

**Flow:**

```
Meta Dashboard                          WAU Backend
     │                                       │
     │  GET /webhook                         │
     │  ?hub.mode=subscribe                  │
     │  &hub.verify_token=myverifytoken      │
     │  &hub.challenge=abc123                │
     │──────────────────────────────────────▶│
     │                                       │
     │                          Verify token matches env var
     │                                       │
     │         200 OK                        │
     │         Body: "abc123"                │
     │◀──────────────────────────────────────│
     │                                       │
     │  ✅ Webhook registered                │
```

**Code path:** `webhook.routes.ts` → `webhook.controller.ts` → `verifyWebhook()`

---

### 2. Incoming Message Flow (POST /webhook)

Every time a user sends a message on WhatsApp, Meta delivers it to your webhook.

```
POST /webhook
Content-Type: application/json

{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "2547XXXXXXXX",
          "type": "text",
          "text": { "body": "Egg sales 200" },
          "timestamp": "1705312000",
          "id": "wamid.xxx"
        }]
      }
    }]
  }]
}
```

---

### 3. Complete Message Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         POST /webhook                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  webhook.controller.ts                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Extract message from Meta payload                                 │    │
│  │ 2. If no message → respond 200 (status update, not a message)       │    │
│  │ 3. Respond 200 immediately (acknowledge to Meta)                     │    │
│  │ 4. Pass message to messageRouter.route()                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  message-router.ts                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Load/create user session from DB                                  │    │
│  │ 2. Check session.module → select handler                             │    │
│  │ 3. Dispatch to handler.handle(message, session)                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Handler Selection:                                                          │
│  ┌──────────────┬──────────────────────────────────────────┐                │
│  │ session.module │ Handler                                  │                │
│  ├──────────────┼──────────────────────────────────────────┤                │
│  │ menu          │ menu.handler.ts                           │                │
│  │ income        │ income.handler.ts                         │                │
│  │ expense       │ expense.handler.ts                        │                │
│  │ report        │ report.handler.ts                         │                │
│  └──────────────┴──────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Handler (e.g., income.handler.ts)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Parse user input (text → entries)                                 │    │
│  │ 2. Validate entries                                                  │    │
│  │ 3. Call service layer → incomeService.addMany()                      │    │
│  │ 4. Send confirmation via whatsappClient.sendText()                   │    │
│  │ 5. Reset session to menu                                             │    │
│  │ 6. Send menu buttons                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Service Layer (e.g., income.service.ts)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Business logic / validation                                       │    │
│  │ 2. Call repository → incomeRepository.insert()                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Repository Layer (e.g., income.repository.ts)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Execute SQL via Knex                                              │    │
│  │ 2. Return inserted record                                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  WhatsApp Client (whatsapp.client.ts)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ POST https://graph.facebook.com/v22.0/{PHONE_ID}/messages            │    │
│  │ → Sends reply back to user on WhatsApp                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Example Flows

#### Flow A: New User Says "Hi"

```
User sends: "hi"
    │
    ▼
message-router: No session found
    │
    ▼
sessionService.getOrCreate() → creates user + session {module: "menu", step: "main"}
    │
    ▼
menuHandler.handle()
    │
    ▼
whatsappClient.sendButtons() → sends 3 buttons:
    ├── 💰 Record Income
    ├── 💸 Record Expense
    └── 📊 Get Report
```

#### Flow B: Record Income

```
User taps: "💰 Record Income"
    │
    ▼
menuHandler → recognizes "income" selection
    │
    ▼
sessionService.update({module: "income", step: "await_input"})
    │
    ▼
whatsappClient.sendText() → "Enter your income items..."
    │
    ▼
User sends: "Egg sales 200\nMilk 500"
    │
    ▼
incomeHandler.handle()
    │
    ▼
parseEntries() → [{description: "Egg sales", amount: 200}, {description: "Milk", amount: 500}]
    │
    ▼
incomeService.addMany() → inserts 2 rows into `transactions` table (type: 'income')
    │
    ▼
whatsappClient.sendText() → "✅ Saved 2 income items"
    │
    ▼
sessionService.reset() → back to menu
    │
    ▼
whatsappClient.sendButtons() → show menu again
```

#### Flow C: Get Report

```
User taps: "📊 Get Report"
    │
    ▼
menuHandler → sends buttons: "Today's Report" / "Weekly Report"
    │
    ▼
User taps: "📆 Weekly Report"
    │
    ▼
reportHandler.handle()
    │
    ▼
reportService.generate(phone, "week")
    │
    ├── transactionRepository.getByPhone(phone, 'income', 7 days ago, today)
    └── transactionRepository.getByPhone(phone, 'expense', 7 days ago, today)
    │
    ▼
generateReportPDF(data) → Buffer (PDF file)
    │
    ▼
whatsappClient.sendDocument(phone, buffer, "Report-Weekly-2025-01-15.pdf")
    │
    ▼
User receives PDF on WhatsApp
    │
    ▼
sessionService.reset() → back to menu
```

---

### 5. Webhook Security

Meta signs every webhook payload with `X-Hub-Signature-256` header. To validate:

```typescript
// Future implementation in middleware
import crypto from 'crypto';

function verifySignature(payload: Buffer, signature: string, appSecret: string): boolean {
  const expected = crypto.createHmac('sha256', appSecret).update(payload).digest('hex');
  return `sha256=${expected}` === signature;
}
```

---

### 6. Session State Machine

```
                    ┌─────────┐
         ┌────────▶│  MENU   │◀────────────────────────────┐
         │         └────┬────┘                              │
         │              │                                   │
         │    User selects option                           │
         │              │                                   │
         │    ┌─────────┼─────────┐                        │
         │    ▼         ▼         ▼                        │
    ┌─────────┐  ┌──────────┐  ┌────────┐                 │
    │ INCOME  │  │ EXPENSE  │  │ REPORT │                  │
    │await_   │  │await_    │  │select_ │                  │
    │input    │  │input     │  │period  │                  │
    └────┬────┘  └────┬─────┘  └───┬────┘                 │
         │            │             │                       │
    User enters  User enters   User selects               │
    items        items         period                      │
         │            │             │                       │
         ▼            ▼             ▼                       │
    Save to DB   Save to DB   Generate PDF                │
         │            │             │                       │
         └────────────┴─────────────┴───── Reset ──────────┘
```

---

## Meta WhatsApp Cloud API Setup

### 1. Create Meta App

1. Go to https://developers.facebook.com/apps/
2. Create App → Select "Business" type
3. Add "WhatsApp" product

### 2. Configure Webhook

1. In WhatsApp → Configuration → Webhook
2. Callback URL: `https://your-domain.com/webhook`
3. Verify Token: same value as `WHATSAPP_VERIFY_TOKEN` in your `.env`
4. Subscribe to: `messages`

> Your server must be publicly accessible over HTTPS for Meta to reach it. Deploy to a VPS with a domain and SSL (e.g., Nginx + Let's Encrypt), or use a cloud service like AWS EC2/Lightsail.

---

## Project Structure

```
wau-backend/
├── src/
│   ├── config/index.ts              # Env config loader
│   ├── controllers/
│   │   ├── webhook.controller.ts    # WhatsApp webhook handlers
│   │   └── admin.controller.ts      # Admin REST API + login
│   ├── middleware/
│   │   ├── error.middleware.ts      # Global error handler
│   │   ├── auth.middleware.ts       # API key auth
│   │   └── request-logger.middleware.ts
│   ├── modules/
│   │   ├── user/                    # User lookup (phone → id resolution)
│   │   ├── transaction/             # Unified income/expense repository & service
│   │   ├── income/                  # Income service (delegates to transaction)
│   │   ├── expense/                 # Expense service (delegates to transaction)
│   │   ├── report/                  # Report + PDF generation
│   │   ├── subscription/           # Plan/payment gating
│   │   └── ai/                     # AI provider facade
│   ├── services/
│   │   ├── whatsapp/               # WhatsApp API client
│   │   ├── session/                # Conversation state
│   │   └── message-router/         # Message dispatch + handlers
│   ├── database/
│   │   ├── connection.ts           # Knex instance
│   │   ├── migrations/             # Schema migrations
│   │   └── seeds/                  # Database seeders
│   ├── utils/                      # Logger, date, parser, audit
│   ├── routes/                     # Express route definitions
│   ├── types/                      # TS type augmentations
│   ├── app.ts                      # Express app setup
│   └── server.ts                   # Entry point
├── tests/
├── .env.example
├── tsconfig.json
├── knexfile.ts
└── package.json
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (tsx watch) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm run build:sit` | Compile TypeScript → `dist-sit/` |
| `npm run build:uat` | Compile TypeScript → `dist-uat/` |
| `npm run build:live` | Compile TypeScript → `dist-live/` |
| `npm start` | Run compiled build from `dist/` |
| `npm run start:sit` | Run `dist-sit/` with `.env.sit` |
| `npm run start:uat` | Run `dist-uat/` with `.env.uat` |
| `npm run start:live` | Run `dist-live/` with `.env.live` |
| `npm run migrate` | Run all pending migrations |
| `npm run migrate:rollback` | Rollback last migration batch |
| `npm run migrate:make <name>` | Create new migration file |
| `npm run seed` | Run database seeders (creates default admin) |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (vitest) |

---

## Adding New Modules

1. Create folder: `src/modules/<name>/`
2. Add files:
   - `<name>.types.ts` — interfaces
   - `<name>.repository.ts` — DB queries
   - `<name>.service.ts` — business logic
3. Create handler: `src/services/message-router/handlers/<name>.handler.ts`
4. Register handler in `src/services/message-router/message-router.ts`
5. Add menu option in `src/services/message-router/handlers/menu.handler.ts`
6. Add migration if new tables needed

---

## Admin Authentication

### Login Flow

The admin dashboard uses username/password authentication. On successful login, the backend returns an API key which the frontend stores in `sessionStorage` for subsequent requests.

```
POST /api/admin/login
Content-Type: application/json

{ "username": "admin", "password": "Welcome@123" }

→ 200 { "apiKey": "<ADMIN_API_KEY>" }
→ 401 { "error": "Invalid credentials" }
```

All other `/api/admin/*` endpoints require the `x-api-key` header with the returned API key.

### Default Admin Credentials

| Username | Password |
|----------|----------|
| `admin` | `Welcome@123` |

> Change the default password in production by updating the `admins` table directly or adding a password-change endpoint.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not verifying | Check `WHATSAPP_VERIFY_TOKEN` matches Meta dashboard |
| Messages not arriving | Ensure your server is publicly accessible and webhook URL is correct in Meta |
| DB connection refused | Verify MySQL is running and credentials are correct |
| `Cannot find module` | Run `npm install` and check import paths |
| Meta returns 400 | Check `WHATSAPP_TOKEN` is valid (regenerate if expired) |
| Duplicate messages | Meta retries if you don't respond 200 within 5s — we acknowledge immediately |
| Admin login fails | Run `npm run seed` to create default admin user |

---

## Production Deployment

```bash
# Build for specific environment
npm run build:live

# Run with PM2
pm2 start dist-live/server.js --name wau-backend --env-file .env.live

# Or with Docker
docker build -t wau-backend .
docker run -p 3344:3344 --env-file .env.live wau-backend
```

---

## License

Private — WAU Business Assistant
