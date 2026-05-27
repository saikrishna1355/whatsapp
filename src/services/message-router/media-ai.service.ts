import { getAIProvider } from '../../modules/ai/ai.service';
import type { ParsedEntry } from '../../utils/parse-entries';
import type { MediaPayload } from '../whatsapp/whatsapp.types';
import { whatsappClient } from '../whatsapp/whatsapp.client';
import { logger } from '../../utils/logger';

export async function extractEntriesFromMedia(media: MediaPayload, module: 'income' | 'expense'): Promise<ParsedEntry[]> {
  logger.info({ mediaType: media.type, mediaId: media.mediaId, module }, 'Starting media extraction');
  const provider = getAIProvider();
  const meta = await whatsappClient.getMediaUrl(media.mediaId);
  const mimeType = media.mimeType || meta.mime_type || '';
  const buffer = await whatsappClient.downloadMedia(meta.url);
  logger.debug({ mediaType: media.type, mimeType, size: buffer.length, module }, 'Media downloaded');

  if (media.type === 'image') {
    const entries = await provider.analyzeImage(buffer, mimeType, module);
    logger.info({ module, count: entries.length }, 'Image analyzed and entries extracted');
    return entries;
  }

  if (media.type === 'audio') {
    logger.info({ mimeType, module }, 'Starting audio transcription');
    const transcript = await provider.transcribeAudio(buffer, mimeType);
    logger.debug({ transcriptLength: transcript.length, module }, 'Audio transcription completed');
    if (!transcript?.trim()) return [];
    const entries = await provider.extractEntries(transcript, module);
    logger.info({ module, count: entries.length }, 'Audio transcript converted to entries');
    return entries;
  }

  logger.warn({ mediaType: media.type, module }, 'Unsupported media type for extraction');
  return [];
}
