import type { ParsedEntry } from '../../utils/parse-entries';

export interface AIProvider {
  extractEntries(text: string, module: string): Promise<ParsedEntry[]>;
  analyzeImage(buffer: Buffer, mimeType: string, module: string): Promise<ParsedEntry[]>;
  transcribeAudio(buffer: Buffer, mimeType: string): Promise<string>;
}
