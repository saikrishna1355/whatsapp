"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bedrockProvider = void 0;
exports.bedrockProvider = {
    async extractEntries(_text, _module) {
        // TODO: Implement Bedrock Claude structured extraction
        throw new Error('Bedrock extractEntries not implemented');
    },
    async analyzeImage(_buffer, _mimeType, _module) {
        // TODO: Implement Bedrock Claude vision for receipt analysis
        throw new Error('Bedrock analyzeImage not implemented');
    },
    async transcribeAudio(_buffer, _mimeType) {
        // TODO: Implement AWS Transcribe
        throw new Error('Bedrock transcribeAudio not implemented');
    },
};
//# sourceMappingURL=bedrock.provider.js.map