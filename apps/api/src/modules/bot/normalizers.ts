export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '').trim();
}

export function normalizeName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function normalizeZone(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}
