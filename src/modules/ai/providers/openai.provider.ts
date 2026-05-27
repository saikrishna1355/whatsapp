import type { AIProvider } from '../ai.types';
import type { ParsedEntry } from '../../../utils/parse-entries';

export const openaiProvider: AIProvider = {
  async extractEntries(_text: string, _module: string): Promise<ParsedEntry[]> {
    // TODO: Implement OpenAI structured extraction
    throw new Error('OpenAI extractEntries not implemented');
  },

  async analyzeImage(_buffer: Buffer, _mimeType: string, _module: string): Promise<ParsedEntry[]> {
    // TODO: Implement OpenAI vision for receipt analysis
    throw new Error('OpenAI analyzeImage not implemented');
  },

  async transcribeAudio(_buffer: Buffer, _mimeType: string): Promise<string> {
    // TODO: Implement OpenAI Whisper transcription
    throw new Error('OpenAI transcribeAudio not implemented');
  },
};
