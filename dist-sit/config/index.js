"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
function required(key) {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required env var: ${key}`);
    return value;
}
function optional(key, fallback) {
    return process.env[key] || fallback;
}
exports.config = {
    nodeEnv: optional('NODE_ENV', 'development'),
    port: parseInt(optional('PORT', '3344'), 10),
    isProduction: process.env.NODE_ENV === 'production',
    whatsapp: {
        token: required('WHATSAPP_TOKEN'),
        phoneNumberId: required('WHATSAPP_PHONE_NUMBER_ID'),
        verifyToken: required('WHATSAPP_VERIFY_TOKEN'),
        testMode: optional('WHATSAPP_TEST_MODE', 'false') === 'true',
        apiVersion: optional('WHATSAPP_API_VERSION', 'v22.0'),
    },
    db: {
        host: optional('DB_HOST', '127.0.0.1'),
        port: parseInt(optional('DB_PORT', '3306'), 10),
        user: required('DB_USER'),
        password: optional('DB_PASSWORD', ''),
        name: required('DB_NAME'),
    },
    ai: {
        provider: optional('AI_PROVIDER', 'none'),
        openai: {
            apiKey: optional('OPENAI_API_KEY', ''),
            model: optional('OPENAI_MODEL', 'gpt-4o-mini'),
        },
        bedrock: {
            region: optional('AWS_BEDROCK_REGION', 'us-east-1'),
            model: optional('AWS_BEDROCK_MODEL', 'anthropic.claude-3-5-haiku-20241022-v1:0'),
            maxTokens: parseInt(optional('AWS_BEDROCK_MAX_TOKENS', '800'), 10),
        },
        transcribe: {
            region: optional('AWS_TRANSCRIBE_REGION', 'us-east-1'),
            bucket: optional('AWS_TRANSCRIBE_BUCKET', ''),
            languageCode: optional('AWS_TRANSCRIBE_LANGUAGE_CODE', 'en-US'),
            pollMs: parseInt(optional('AWS_TRANSCRIBE_POLL_MS', '2500'), 10),
            timeoutMs: parseInt(optional('AWS_TRANSCRIBE_TIMEOUT_MS', '120000'), 10),
        },
    },
    storage: {
        provider: optional('STORAGE_PROVIDER', 'local'),
        s3: {
            bucket: optional('AWS_S3_BUCKET', ''),
            region: optional('AWS_S3_REGION', ''),
        },
    },
    subscription: {
        enabled: optional('SUBSCRIPTION_ENABLED', 'false') === 'true',
    },
    web: {
        corsOrigin: optional('WEB_CORS_ORIGIN', 'http://localhost:3000'),
    },
};
//# sourceMappingURL=index.js.map