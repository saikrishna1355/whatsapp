import axios from 'axios';
import FormData from 'form-data';
import { config } from '../../config';
import { logger } from '../../utils/logger';
import type { Button, ListSection } from './whatsapp.types';

const baseUrl = `https://graph.facebook.com/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}`;
const messagesUrl = `${baseUrl}/messages`;
const mediaUrl = `${baseUrl}/media`;
const graphUrl = `https://graph.facebook.com/${config.whatsapp.apiVersion}`;

const headers = {
  Authorization: `Bearer ${config.whatsapp.token}`,
  'Content-Type': 'application/json',
};

export interface TestReply {
  type: 'text' | 'buttons' | 'list' | 'document';
  to: string;
  body?: string;
  buttons?: Button[];
  sections?: ListSection[];
  filename?: string;
  size?: number;
}

// Per-request reply collector for test mode
let testReplies: TestReply[] = [];

export function collectTestReplies(): TestReply[] {
  const replies = [...testReplies];
  testReplies = [];
  return replies;
}

export function resetTestReplies(): void {
  testReplies = [];
}

function isTestMode(): boolean {
  return config.whatsapp.testMode;
}

export const whatsappClient = {
  async indicateTyping(messageId: string): Promise<void> {
    if (isTestMode()) return;
    await axios.post(messagesUrl, {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
      typing_indicator: {
        type: 'text',
      },
    }, { headers });
  },

  async sendText(to: string, body: string): Promise<void> {
    if (isTestMode()) {
      logger.debug({ to, body }, '[TEST_MODE] sendText');
      testReplies.push({ type: 'text', to, body });
      return;
    }
    await axios.post(messagesUrl, {
      messaging_product: 'whatsapp',
      to,
      text: { body },
    }, { headers });
  },

  async sendButtons(to: string, body: string, buttons: Button[]): Promise<void> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: {
          buttons: buttons.map((btn) => ({
            type: 'reply',
            reply: { id: btn.id, title: btn.title.slice(0, 20) },
          })),
        },
      },
    };

    if (isTestMode()) {
      logger.debug({ to, body, buttons }, '[TEST_MODE] sendButtons');
      testReplies.push({ type: 'buttons', to, body, buttons });
      return;
    }
    await axios.post(messagesUrl, payload, { headers });
  },

  async sendList(to: string, body: string, buttonText: string, sections: ListSection[]): Promise<void> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: body },
        action: {
          button: buttonText.slice(0, 20),
          sections,
        },
      },
    };

    if (isTestMode()) {
      logger.debug({ to, body, sections }, '[TEST_MODE] sendList');
      testReplies.push({ type: 'list', to, body, sections });
      return;
    }
    await axios.post(messagesUrl, payload, { headers });
  },

  async sendDocument(to: string, pdfBuffer: Buffer, filename: string): Promise<void> {
    if (isTestMode()) {
      logger.debug({ to, filename, size: pdfBuffer.length }, '[TEST_MODE] sendDocument');
      testReplies.push({ type: 'document', to, filename, size: pdfBuffer.length });
      return;
    }

    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('file', pdfBuffer, { filename, contentType: 'application/pdf' });
    form.append('type', 'application/pdf');

    const uploadRes = await axios.post(mediaUrl, form, {
      headers: { Authorization: `Bearer ${config.whatsapp.token}`, ...form.getHeaders() },
    });

    await axios.post(messagesUrl, {
      messaging_product: 'whatsapp',
      to,
      type: 'document',
      document: { id: uploadRes.data.id, filename },
    }, { headers });
  },

  async getMediaUrl(mediaId: string): Promise<{ url: string; mime_type: string }> {
    const res = await axios.get(`${graphUrl}/${mediaId}`, {
      headers: { Authorization: `Bearer ${config.whatsapp.token}` },
    });
    return res.data;
  },

  async downloadMedia(url: string): Promise<Buffer> {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { Authorization: `Bearer ${config.whatsapp.token}` },
    });
    return Buffer.from(res.data);
  },
};
