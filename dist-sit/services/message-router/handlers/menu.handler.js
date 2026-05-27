"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuHandler = void 0;
exports.sendMenu = sendMenu;
const whatsapp_client_1 = require("../../whatsapp/whatsapp.client");
const session_service_1 = require("../../session/session.service");
const connection_1 = require("../../../database/connection");
async function getFlowData() {
    const row = await (0, connection_1.db)('flow').where('key', 'conversation_flow').first();
    if (!row)
        return null;
    return typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
}
exports.menuHandler = {
    async handle(message, session) {
        const { from, text } = message;
        const normalized = text?.toLowerCase() || '';
        const flow = await getFlowData();
        if (!flow || !flow.conversation?.length) {
            await whatsapp_client_1.whatsappClient.sendText(from, 'Service is currently unavailable. Please try again later.');
            return;
        }
        const mainConversation = flow.conversation[0];
        const menuOptions = (mainConversation.answers || [])
            .filter((a) => a.active)
            .map((a) => ({ id: a.clickId || a.key, title: a.text }));
        const menuBody = `${mainConversation.question}\n\n${mainConversation.dummy || ''}`;
        // Greeting or fresh session → show menu
        if (!text || normalized === 'hi' || normalized === 'hello' || normalized === 'menu') {
            await whatsapp_client_1.whatsappClient.sendButtons(from, menuBody, menuOptions);
            return;
        }
        // Route to selected module
        const selectedAnswer = (mainConversation.answers || []).find((a) => a.active && (a.clickId === normalized || a.key === normalized || a.text?.toLowerCase().includes(normalized)));
        if (selectedAnswer) {
            const moduleId = selectedAnswer.clickId || selectedAnswer.key;
            await session_service_1.sessionService.update(from, { module: moduleId, step: 'await_input' });
            const followUp = selectedAnswer.followUp?.[0];
            if (followUp) {
                const followUpAnswers = followUp.answers || [];
                const hasButtons = followUpAnswers.some((a) => a.input === 'button');
                if (hasButtons) {
                    const buttons = followUpAnswers
                        .filter((a) => a.active)
                        .map((a) => ({ id: a.clickId || a.key, title: a.text }));
                    await whatsapp_client_1.whatsappClient.sendButtons(from, followUp.question || 'Choose an option:', buttons);
                }
                else {
                    const prompt = followUp.question + (followUp.dummy ? `\n\n${followUp.dummy}` : '');
                    await whatsapp_client_1.whatsappClient.sendText(from, prompt);
                }
            }
            return;
        }
        // Invalid selection
        await whatsapp_client_1.whatsappClient.sendText(from, "I didn't understand that. Let me show you the menu.");
        await whatsapp_client_1.whatsappClient.sendButtons(from, menuBody, menuOptions);
    },
};
async function sendMenu(to) {
    const flow = await getFlowData();
    if (!flow || !flow.conversation?.length) {
        await whatsapp_client_1.whatsappClient.sendText(to, 'Welcome! Service is being set up.');
        return;
    }
    const mainConversation = flow.conversation[0];
    const menuOptions = (mainConversation.answers || [])
        .filter((a) => a.active)
        .map((a) => ({ id: a.clickId || a.key, title: a.text }));
    const menuBody = `${mainConversation.question}\n\n${mainConversation.dummy || ''}`;
    await whatsapp_client_1.whatsappClient.sendButtons(to, menuBody, menuOptions);
}
//# sourceMappingURL=menu.handler.js.map