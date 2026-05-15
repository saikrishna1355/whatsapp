const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");

function getAbsoluteMediaPath(capture) {
  return path.join(DATA_DIR, capture.file_path);
}

function getEntryKind(moduleName) {
  return moduleName === "saveExpense" ? "expense" : "income";
}

function getExtractionPrompt(moduleName, sourceLabel = "content") {
  return `Extract farm ${getEntryKind(moduleName)} entries from this ${sourceLabel}.
Return only valid JSON with this shape:
{"entries":[{"description":"Egg sales","amount":200}]}

Rules:
- Use short item descriptions.
- Convert spoken or written number words into numeric amounts.
- Ignore totals unless they are the only amount available.
- If no entries are found, return {"entries":[]}.`;
}

function parseJsonObject(raw) {
  const text = String(raw || "").trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

function normalizeEntries(entries) {
  if (!Array.isArray(entries)) return [];

  return entries
    .map((entry) => ({
      description: String(entry.description || "").trim(),
      amount: Number(entry.amount),
    }))
    .filter(
      (entry) =>
        entry.description && Number.isFinite(entry.amount) && entry.amount > 0,
    );
}

module.exports = {
  getAbsoluteMediaPath,
  getEntryKind,
  getExtractionPrompt,
  parseJsonObject,
  normalizeEntries,
};
