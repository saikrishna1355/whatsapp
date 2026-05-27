"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappClient = void 0;
exports.collectTestReplies = collectTestReplies;
exports.resetTestReplies = resetTestReplies;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const baseUrl = `https://graph.facebook.com/${config_1.config.whatsapp.apiVersion}/${config_1.config.whatsapp.phoneNumberId}`;
const messagesUrl = `${baseUrl}/messages`;
const mediaUrl = `${baseUrl}/media`;
const graphUrl = `https://graph.facebook.com/${config_1.config.whatsapp.apiVersion}`;
const headers = {
    Authorization: `Bearer ${config_1.config.whatsapp.token}`,
    'Content-Type': 'application/json',
};
// Per-request reply collector for test mode
let testReplies = [];
function collectTestReplies() {
    const replies = [...testReplies];
    testReplies = [];
    return replies;
}
function resetTestReplies() {
    testReplies = [];
}
function isTestMode() {
    return config_1.config.whatsapp.testMode;
}
function withNavButtons(buttons) {
    const out = [...buttons];
    const nav = [
        { id: 'back', title: 'Back' },
        { id: 'home', title: 'Home' },
    ];
    for (const b of nav) {
        if (out.length >= 3)
            break;
        if (!out.some((x) => x.id === b.id))
            out.push(b);
    }
    return out.slice(0, 3);
}
exports.whatsappClient = {
    async indicateTyping(messageId) {
        if (isTestMode())
            return;
        await axios_1.default.post(messagesUrl, {
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId,
            typing_indicator: {
                type: 'text',
            },
        }, { headers });
    },
    async sendText(to, body) {
        if (isTestMode()) {
            logger_1.logger.debug({ to, body }, '[TEST_MODE] sendText');
            testReplies.push({ type: 'text', to, body });
            return;
        }
        await axios_1.default.post(messagesUrl, {
            messaging_product: 'whatsapp',
            to,
            text: { body },
        }, { headers });
    },
    async sendSupportFlow(to) {
        if (isTestMode()) {
            testReplies.push({ type: 'flow', to, body: 'Support Flow opened' });
            return;
        }
        await axios_1.default.post(messagesUrl, {
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
                type: 'flow',
                header: { type: 'text', text: 'Customer Support' },
                body: { text: 'Share your issue using the support form.' },
                footer: { text: 'Your request will be reviewed by our team.' },
                action: {
                    name: 'flow',
                    parameters: {
                        flow_message_version: '3',
                        flow_id: config_1.config.whatsapp.supportFlowId,
                        flow_cta: 'Open Support Form',
                        flow_action: 'navigate',
                        flow_action_payload: {
                            screen: 'SUPPORT_HOME',
                            data: {},
                        },
                    },
                },
            },
        }, { headers });
    },
    async sendButtons(to, body, buttons) {
        const finalButtons = withNavButtons(buttons);
        const payload = {
            messaging_product: 'whatsapp',
            to,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: { text: body },
                action: {
                    buttons: finalButtons.map((btn) => ({
                        type: 'reply',
                        reply: { id: btn.id, title: btn.title.slice(0, 20) },
                    })),
                },
            },
        };
        if (isTestMode()) {
            logger_1.logger.debug({ to, body, buttons: finalButtons }, '[TEST_MODE] sendButtons');
            testReplies.push({ type: 'buttons', to, body, buttons: finalButtons });
            return;
        }
        await axios_1.default.post(messagesUrl, payload, { headers });
    },
    async sendList(to, body, buttonText, sections) {
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
            logger_1.logger.debug({ to, body, sections }, '[TEST_MODE] sendList');
            testReplies.push({ type: 'list', to, body, sections });
            return;
        }
        await axios_1.default.post(messagesUrl, payload, { headers });
    },
    async sendDocument(to, pdfBuffer, filename) {
        if (isTestMode()) {
            logger_1.logger.debug({ to, filename, size: pdfBuffer.length }, '[TEST_MODE] sendDocument');
            testReplies.push({ type: 'document', to, filename, size: pdfBuffer.length });
            return;
        }
        const form = new form_data_1.default();
        form.append('messaging_product', 'whatsapp');
        form.append('file', pdfBuffer, { filename, contentType: 'application/pdf' });
        form.append('type', 'application/pdf');
        const uploadRes = await axios_1.default.post(mediaUrl, form, {
            headers: { Authorization: `Bearer ${config_1.config.whatsapp.token}`, ...form.getHeaders() },
        });
        await axios_1.default.post(messagesUrl, {
            messaging_product: 'whatsapp',
            to,
            type: 'document',
            document: { id: uploadRes.data.id, filename },
        }, { headers });
    },
    async getMediaUrl(mediaId) {
        const res = await axios_1.default.get(`${graphUrl}/${mediaId}`, {
            headers: { Authorization: `Bearer ${config_1.config.whatsapp.token}` },
        });
        return res.data;
    },
    async downloadMedia(url) {
        const res = await axios_1.default.get(url, {
            responseType: 'arraybuffer',
            headers: { Authorization: `Bearer ${config_1.config.whatsapp.token}` },
        });
        return Buffer.from(res.data);
    },
};
//# sourceMappingURL=whatsapp.client.js.map