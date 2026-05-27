"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIProvider = getAIProvider;
const config_1 = require("../../config");
function getAIProvider() {
    switch (config_1.config.ai.provider) {
        case 'openai':
            // Lazy import to avoid loading SDK when not needed
            return require('./providers/openai.provider').openaiProvider;
        case 'bedrock':
            return require('./providers/bedrock.provider').bedrockProvider;
        default:
            throw new Error(`AI provider not configured. Set AI_PROVIDER env var.`);
    }
}
//# sourceMappingURL=ai.service.js.map