"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiProvider = void 0;
exports.openaiProvider = {
    async extractEntries(_text, _module) {
        // TODO: Implement OpenAI structured extraction
        throw new Error('OpenAI extractEntries not implemented');
    },
    async analyzeImage(_buffer, _mimeType, _module) {
        // TODO: Implement OpenAI vision for receipt analysis
        throw new Error('OpenAI analyzeImage not implemented');
    },
    async transcribeAudio(_buffer, _mimeType) {
        // TODO: Implement OpenAI Whisper transcription
        throw new Error('OpenAI transcribeAudio not implemented');
    },
};
//# sourceMappingURL=openai.provider.js.map