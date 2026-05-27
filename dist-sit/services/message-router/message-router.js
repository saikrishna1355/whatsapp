"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const session_service_1 = require("../session/session.service");
const menu_handler_1 = require("./handlers/menu.handler");
const income_handler_1 = require("./handlers/income.handler");
const expense_handler_1 = require("./handlers/expense.handler");
const report_handler_1 = require("./handlers/report.handler");
const menu_handler_2 = require("./handlers/menu.handler");
const logger_1 = require("../../utils/logger");
const parse_entries_1 = require("../../utils/parse-entries");
const whatsapp_client_1 = require("../whatsapp/whatsapp.client");
const PENDING_EXPIRE_MINUTES = 3;
const handlers = {
    menu: menu_handler_1.menuHandler,
    income: income_handler_1.incomeHandler,
    expense: expense_handler_1.expenseHandler,
    report: report_handler_1.reportHandler,
};
exports.messageRouter = {
    async route(message) {
        const { from } = message;
        try {
            let session = await session_service_1.sessionService.getOrCreate(from);
            const normalized = message.text?.trim().toLowerCase();
            if (normalized === 'back' || normalized === 'home') {
                await session_service_1.sessionService.reset(from);
                await (0, menu_handler_2.sendMenu)(from);
                return;
            }
            if (session.step === 'await_ai_confirmation' || session.step === 'await_ai_edit') {
                const elapsedMins = (Date.now() - new Date(session.updatedAt).getTime()) / 1000 / 60;
                if (elapsedMins > PENDING_EXPIRE_MINUTES) {
                    await session_service_1.sessionService.reset(from);
                    await whatsapp_client_1.whatsappClient.sendText(from, 'Inactive detected. Please send hi to start again.');
                    session = await session_service_1.sessionService.getOrCreate(from);
                }
            }
            logger_1.logger.debug({ from, module: session.module, step: session.step, text: message.text }, 'Routing message');
            if (session.module === 'menu' && message.text) {
                const entries = (0, parse_entries_1.parseEntries)(message.text);
                if (entries.length > 0) {
                    const lowered = message.text.toLowerCase();
                    const expenseHints = ['expense', 'spent', 'buy', 'bought', 'paid', 'fuel', 'feed', 'transport'];
                    const looksExpense = expenseHints.some((hint) => lowered.includes(hint));
                    const autoModule = looksExpense ? 'expense' : 'income';
                    logger_1.logger.info({ from, autoModule, entries: entries.length }, 'Auto-routing parsed text from menu');
                    await session_service_1.sessionService.update(from, { module: autoModule, step: 'await_input' });
                    const handler = autoModule === 'expense' ? expense_handler_1.expenseHandler : income_handler_1.incomeHandler;
                    await handler.handle(message, { ...session, module: autoModule, step: 'await_input' });
                    return;
                }
            }
            const handler = handlers[session.module] || menu_handler_1.menuHandler;
            await handler.handle(message, session);
        }
        catch (err) {
            logger_1.logger.error({ err, from }, 'Message routing failed');
            try {
                const { whatsappClient } = await Promise.resolve().then(() => __importStar(require('../whatsapp/whatsapp.client')));
                await whatsappClient.sendText(from, 'Sorry, something went wrong. Please try again.');
            }
            catch {
                // Swallow — can't notify user
            }
        }
    },
};
//# sourceMappingURL=message-router.js.map