"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.today = today;
exports.daysAgo = daysAgo;
exports.toDateStr = toDateStr;
exports.formatDate = formatDate;
function today() {
    return new Date().toISOString().slice(0, 10);
}
function daysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
}
function toDateStr(value) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
        return value;
    const d = new Date(value);
    return d.toISOString().slice(0, 10);
}
function formatDate(value) {
    const d = new Date(value);
    if (isNaN(d.getTime()))
        return String(value);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    let h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${dd}-${mm}-${yyyy} ${String(h).padStart(2, '0')}:${min} ${ampm}`;
}
//# sourceMappingURL=date.js.map