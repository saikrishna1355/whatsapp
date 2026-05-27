# Webhook API — Technical Flow Documentation

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/webhook` | Meta verification handshake |
| POST | `/webhook` | Receive inbound messages |

---

## 1. Verification Handshake (GET /webhook)

Called once by Meta when you register/update your webhook URL.

### Request

```
GET /webhook?hub.mode=subscribe&hub.verify_token=myverifytoken&hub.challenge=1234567890
```

### Logic

```
┌──────────────────────────────────────────────────┐
│ GET /webhook                                      │
│                                                   │
│ Extract query params:                             │
│   mode  = hub.mode                                │
│   token = hub.verify_token                        │
│   challenge = hub.challenge                       │
│                                                   │
│ IF mode === "subscribe"                           │
│    AND token === process.env.WHATSAPP_VERIFY_TOKEN│
│ THEN                                              │
│   → 200 OK, body = challenge (plain text)         │
│ ELSE                                              │
│   → 403 Forbidden                                 │
└──────────────────────────────────────────────────┘
```

### Response

- Success: `200` with challenge string as body
- Failure: `403`

---

## 2. Inbound Message (POST /webhook)

Called by Meta every time a user sends a message, taps a button, or sends media.

### Request Payload Structure

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551234567",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              { "profile": { "name": "John" }, "wa_id": "2547XXXXXXXX" }
            ],
            "messages": [
              {
                "from": "2547XXXXXXXX",
                "id": "wamid.HBgLMjU0NzEyMzQ1Njc4",
                "timestamp": "1705312000",
                "type": "text",
                "text": { "body": "Egg sales 200" }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

### Message Types Handled

| Type | Payload Location | Extracted Value |
|------|-----------------|-----------------|
| Text | `message.text.body` | Raw text string |
| Button reply | `message.interactive.button_reply.id` | Button ID |
| List reply | `message.interactive.list_reply.id` | List item ID |
| Image | `message.image` | `{ id, mime_type, sha256, caption }` |
| Audio | `message.audio` | `{ id, mime_type, sha256 }` |
| Document | `message.document` | `{ id, mime_type, filename }` |

---

## 3. Processing Pipeline

```
POST /webhook
    │
    ├─── Step 1: EXTRACT ──────────────────────────────────────────────────┐
    │    extractInboundMessage(req.body)                                     │
    │    → Returns: { from, text, mediaPayload, timestamp, messageId }      │
    │    → Returns null if payload is a status update (not a message)        │
    └───────────────────────────────────────────────────────────────────────┘
    │
    ├─── Step 2: ACKNOWLEDGE ──────────────────────────────────────────────┐
    │    res.sendStatus(200)                                                 │
    │    → MUST respond within 5 seconds or Meta will retry                 │
    │    → We acknowledge BEFORE processing to avoid duplicates             │
    └───────────────────────────────────────────────────────────────────────┘
    │
    ├─── Step 3: ROUTE ────────────────────────────────────────────────────┐
    │    messageRouter.route(message)                                        │
    │                                                                        │
    │    3a. Load session: sessionService.getOrCreate(from)                  │
    │        → Resolves phone → user_id via userRepository.ensureExists()   │
    │        → If no session exists: create user + session (module: "menu") │
    │        → If session expired (>30 min): reset to menu                  │
    │                                                                        │
    │    3b. Select handler based on session.module:                         │
    │        "menu"    → menuHandler                                         │
    │        "income"  → incomeHandler                                       │
    │        "expense" → expenseHandler                                      │
    │        "report"  → reportHandler                                       │
    │        unknown   → menuHandler (fallback)                              │
    │                                                                        │
    │    3c. Call handler.handle(message, session)                            │
    └───────────────────────────────────────────────────────────────────────┘
    │
    ├─── Step 4: HANDLE ───────────────────────────────────────────────────┐
    │    Handler processes the message:                                      │
    │    → Parse input (text → structured entries)                           │
    │    → Validate data                                                     │
    │    → Call service layer (business logic)                               │
    │    → Service calls transactionRepository (single `transactions` table) │
    │    → Send reply via whatsappClient                                     │
    │    → Update session state                                              │
    └───────────────────────────────────────────────────────────────────────┘
    │
    ├─── Step 5: REPLY ────────────────────────────────────────────────────┐
    │    whatsappClient sends HTTP POST to Meta Graph API:                   │
    │    POST https://graph.facebook.com/v22.0/{PHONE_ID}/messages          │
    │                                                                        │
    │    Reply types:                                                         │
    │    → sendText(to, body)         — plain text message                  │
    │    → sendButtons(to, body, [])  — up to 3 interactive buttons         │
    │    → sendList(to, body, btn, sections) — scrollable list              │
    │    → sendDocument(to, buffer, filename) — PDF/file attachment         │
    └───────────────────────────────────────────────────────────────────────┘
```

---

## 4. Handler Detail: Menu

```
INPUT: Any text when session.module === "menu"

┌─────────────────────────────────────────────────────┐
│ menuHandler.handle(message, session)                  │
│                                                       │
│ IF text is "hi" / "hello" / "menu" / null            │
│   → sendButtons(from, welcomeText, menuOptions)      │
│                                                       │
│ ELSE IF text matches a menu option ID                 │
│   → Update session: {module: selected.id, step: "await_input"}
│   → Send prompt for that module                       │
│                                                       │
│ ELSE                                                  │
│   → sendText("I didn't understand that...")           │
│   → sendButtons(from, welcomeText, menuOptions)      │
└─────────────────────────────────────────────────────┘

Menu Options:
  { id: "income",  title: "💰 Record Income" }
  { id: "expense", title: "💸 Record Expense" }
  { id: "report",  title: "📊 Get Report" }
```

---

## 5. Handler Detail: Income / Expense

```
INPUT: Text when session.module === "income" or "expense"

┌─────────────────────────────────────────────────────┐
│ incomeHandler.handle(message, session)                │
│                                                       │
│ IF no text (media only without text support yet)      │
│   → sendText("Please enter as text...")               │
│   → return                                            │
│                                                       │
│ parseEntries(text):                                   │
│   "Egg sales 200\nMilk 500"                          │
│   → [{description: "Egg sales", amount: 200},        │
│      {description: "Milk", amount: 500}]             │
│                                                       │
│ IF entries.length === 0                               │
│   → sendText("Couldn't parse. Use format...")         │
│   → return                                            │
│                                                       │
│ incomeService.addMany(from, entries)                  │
│   → inserts each entry into `transactions` table      │
│     (type: 'income', user_id resolved from phone)     │
│                                                       │
│ sendText("✅ Saved 2 income items:\n• Egg sales: 200\n• Milk: 500")
│                                                       │
│ sessionService.reset(from)                            │
│ sendMenu(from)                                        │
└─────────────────────────────────────────────────────┘
```

---

## 6. Handler Detail: Report

```
INPUT: Button reply when session.module === "report"

┌─────────────────────────────────────────────────────┐
│ reportHandler.handle(message, session)                │
│                                                       │
│ Determine period from text:                           │
│   "report_week" or contains "week" → "week"          │
│   else → "today"                                      │
│                                                       │
│ reportService.generate(from, period):                 │
│   → Query transactions (type='income') for date range │
│   → Query transactions (type='expense') for date range│
│   → Calculate totals + profit                         │
│   → Return ReportData object                          │
│                                                       │
│ generateReportPDF(data):                              │
│   → Create PDF with summary table + line items        │
│   → Return Buffer                                     │
│                                                       │
│ whatsappClient.sendDocument(from, buffer, filename)   │
│   → Upload PDF to Meta media endpoint                 │
│   → Send document message to user                     │
│                                                       │
│ sessionService.reset(from)                            │
│ sendMenu(from)                                        │
└─────────────────────────────────────────────────────┘
```

---

## 7. Error Handling

```
┌─────────────────────────────────────────────────────┐
│ Error at any point in the pipeline:                   │
│                                                       │
│ message-router catches all errors:                    │
│   → logger.error({ err, from }, "Message routing failed")
│   → Attempt to send: "Sorry, something went wrong."  │
│   → If that also fails: swallow silently              │
│                                                       │
│ webhook.controller catches top-level errors:          │
│   → logger.error({ err }, "Webhook handler error")   │
│   → If headers not sent: respond 500                  │
│                                                       │
│ IMPORTANT: Always respond 200 to Meta first.          │
│ Never let processing errors prevent the 200 response. │
└─────────────────────────────────────────────────────┘
```

---

## 8. Outbound Message Types

### Text Message
```json
POST /v22.0/{PHONE_ID}/messages
{
  "messaging_product": "whatsapp",
  "to": "2547XXXXXXXX",
  "text": { "body": "✅ Saved 2 income items" }
}
```

### Button Message (max 3 buttons)
```json
{
  "messaging_product": "whatsapp",
  "to": "2547XXXXXXXX",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "What would you like to do?" },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "income", "title": "💰 Record Income" } },
        { "type": "reply", "reply": { "id": "expense", "title": "💸 Record Expense" } },
        { "type": "reply", "reply": { "id": "report", "title": "📊 Get Report" } }
      ]
    }
  }
}
```

### List Message (more than 3 options)
```json
{
  "messaging_product": "whatsapp",
  "to": "2547XXXXXXXX",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "body": { "text": "Select an option:" },
    "action": {
      "button": "Choose",
      "sections": [
        {
          "title": "Options",
          "rows": [
            { "id": "opt1", "title": "Option 1" },
            { "id": "opt2", "title": "Option 2" }
          ]
        }
      ]
    }
  }
}
```

### Document Message (PDF)
```json
{
  "messaging_product": "whatsapp",
  "to": "2547XXXXXXXX",
  "type": "document",
  "document": { "id": "<uploaded_media_id>", "filename": "Report-Weekly.pdf" }
}
```

---

## 9. Rate Limits & Best Practices

| Rule | Detail |
|------|--------|
| Acknowledge fast | Respond 200 within 5 seconds |
| No duplicate processing | Meta retries after timeout — use messageId for dedup if needed |
| Conversation window | You can only message users within 24h of their last message (or use templates) |
| Button title limit | Max 20 characters |
| List row title limit | Max 24 characters |
| Text body limit | Max 4096 characters |
| Buttons per message | Max 3 |
| List rows per section | Max 10 |

---

## 10. Testing Locally

```bash
# 1. Start server
npm run dev

# 2. Simulate webhook verification
curl "http://localhost:3344/webhook?hub.mode=subscribe&hub.verify_token=myverifytoken&hub.challenge=test123"
# Expected: "test123"

# 3. Simulate incoming message
curl -X POST http://localhost:3344/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "2547XXXXXXXX",
            "id": "wamid.test",
            "timestamp": "1705312000",
            "type": "text",
            "text": {"body": "hi"}
          }]
        }
      }]
    }]
  }'
# Expected: 200 OK (check logs for message processing)
```

Set `WHATSAPP_TEST_MODE=true` in `.env` to prevent actual WhatsApp API calls during development.

> Your server must be publicly accessible over HTTPS for Meta to deliver webhooks. For development, deploy to a VPS with a domain and SSL, or use a cloud service with a public endpoint.
