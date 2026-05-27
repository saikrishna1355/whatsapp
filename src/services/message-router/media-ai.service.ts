import { getAIProvider } from '../../modules/ai/ai.service';
import type { ParsedEntry } from '../../utils/parse-entries';
import type { MediaPayload } from '../whatsapp/whatsapp.types';
import { whatsappClient } from '../whatsapp/whatsapp.client';

export async function extractEntriesFromMedia(media: MediaPayload, module: 'income' | 'expense'): Promise<ParsedEntry[]> {
  const provider = getAIProvider();
  const meta = await whatsappClient.getMediaUrl(media.mediaId);
  const mimeType = media.mimeType || meta.mime_type || '';
  const buffer = await whatsappClient.downloadMedia(meta.url);

  if (media.type === 'image') {
    return provider.analyzeImage(buffer, mimeType, module);
  }

  if (media.type === 'audio') {
    const transcript = await provider.transcribeAudio(buffer, mimeType);
    if (!transcript?.trim()) return [];
    return provider.extractEntries(transcript, module);
  }

  return [];
}
