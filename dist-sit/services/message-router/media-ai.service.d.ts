import type { ParsedEntry } from '../../utils/parse-entries';
import type { MediaPayload } from '../whatsapp/whatsapp.types';
export declare function extractEntriesFromMedia(media: MediaPayload, module: 'income' | 'expense'): Promise<ParsedEntry[]>;
