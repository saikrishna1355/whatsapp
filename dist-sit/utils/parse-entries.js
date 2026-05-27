"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntries = parseEntries;
function parseEntries(text) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const entries = [];
    for (const line of lines) {
        const match = line.match(/^(.+?)\s+(\d+(?:\.\d{1,2})?)$/);
        if (match) {
            entries.push({
                description: match[1].trim(),
                amount: Number(match[2]),
            });
        }
    }
    return entries;
}
//# sourceMappingURL=parse-entries.js.map