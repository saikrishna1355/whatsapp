export interface ParsedEntry {
  description: string;
  amount: number;
}

export function parseEntries(text: string): ParsedEntry[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const entries: ParsedEntry[] = [];

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
