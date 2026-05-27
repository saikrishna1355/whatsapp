"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntries = parseEntries;
function cleanDescription(raw) {
    return raw
        .replace(/[•\-:]+/g, ' ')
        .replace(/\b(and|then)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^[^a-zA-Z0-9]+/, '')
        .replace(/[^a-zA-Z0-9]+$/, '');
}
function parseEntries(text) {
    const normalized = text
        .replace(/[₹$€£]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);
    const entries = [];
    // Strict line format: "Description 123.45"
    for (const line of lines) {
        const match = line.match(/^(.+?)\s+(\d+(?:\.\d{1,2})?)$/);
        if (match) {
            const description = cleanDescription(match[1]);
            if (!description)
                continue;
            entries.push({
                description,
                amount: Number(match[2]),
            });
        }
    }
    if (entries.length > 0)
        return entries;
    // Fallback for transcript-style single sentence:
    // e.g. "Milk 500 tomatoes 120"
    const pairRegex = /([a-zA-Z][^0-9]*?)\s*(\d+(?:\.\d{1,2})?)/g;
    let m;
    while ((m = pairRegex.exec(normalized)) !== null) {
        const description = cleanDescription(m[1]);
        const amount = Number(m[2]);
        if (!description || !Number.isFinite(amount))
            continue;
        entries.push({ description, amount });
    }
    return entries;
}
//# sourceMappingURL=parse-entries.js.map