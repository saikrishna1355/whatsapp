import type { AIProvider } from '../ai.types';
import type { ParsedEntry } from '../../../utils/parse-entries';

export const bedrockProvider: AIProvider = {
  async extractEntries(_text: string, _module: string): Promise<ParsedEntry[]> {
    // TODO: Implement Bedrock Claude structured extraction
    throw new Error('Bedrock extractEntries not implemented');
  },

  async analyzeImage(_buffer: Buffer, _mimeType: string, _module: string): Promise<ParsedEntry[]> {
    // TODO: Implement Bedrock Claude vision for receipt analysis
    throw new Error('Bedrock analyzeImage not implemented');
  },

  async transcribeAudio(_buffer: Buffer, _mimeType: string): Promise<string> {
    // TODO: Implement AWS Transcribe
    throw new Error('Bedrock transcribeAudio not implemented');
  },
};
