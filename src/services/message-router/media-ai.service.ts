import { getAIProvider } from '../../modules/ai/ai.service';
import type { ParsedEntry } from '../../utils/parse-entries';
import type { MediaPayload } from '../whatsapp/whatsapp.types';
import { whatsappClient } from '../whatsapp/whatsapp.client';
import { logger } from '../../utils/logger';
import { parseEntries } from '../../utils/parse-entries';

export interface MediaExtractionResult {
  entries: ParsedEntry[];
  hintDescription?: string;
}

function guessDescription(text: string): string | undefined {
  const cleaned = text.replace(/[^a-zA-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return undefined;
  const words = cleaned.split(' ').filter(Boolean).slice(0, 3);
  return words.length ? words.join(' ') : undefined;
}

export async function extractEntriesFromMedia(media: MediaPayload, module: 'income' | 'expense'): Promise<MediaExtractionResult> {
  logger.info({ mediaType: media.type, mediaId: media.mediaId, module }, 'Starting media extraction');
  const provider = getAIProvider();
  const meta = await whatsappClient.getMediaUrl(media.mediaId);
  const mimeType = media.mimeType || meta.mime_type || '';
  const buffer = await whatsappClient.downloadMedia(meta.url);
  logger.debug({ mediaType: media.type, mimeType, size: buffer.length, module }, 'Media downloaded');

  if (media.type === 'image') {
    const entries = await provider.analyzeImage(buffer, mimeType, module);
    logger.info({ module, count: entries.length }, 'Image analyzed and entries extracted');
    return { entries };
  }

  if (media.type === 'audio') {
    logger.info({ mimeType, module }, 'Starting audio transcription');
    const transcript = await provider.transcribeAudio(buffer, mimeType);
    logger.debug({ transcriptLength: transcript.length, transcriptPreview: transcript.slice(0, 120), module }, 'Audio transcription completed');
    if (!transcript?.trim()) return { entries: [] };
    let entries = await provider.extractEntries(transcript, module);
    if (entries.length === 0) {
      entries = parseEntries(transcript);
      logger.info({ module, count: entries.length }, 'Fallback parseEntries from transcript');
    }
    logger.info({ module, count: entries.length }, 'Audio transcript converted to entries');
    return { entries, hintDescription: entries.length === 0 ? guessDescription(transcript) : undefined };
  }

  logger.warn({ mediaType: media.type, module }, 'Unsupported media type for extraction');
  return { entries: [] };
}
