export interface ParsedEntry {
    description: string;
    amount: number;
}
export declare function parseEntries(text: string): ParsedEntry[];
