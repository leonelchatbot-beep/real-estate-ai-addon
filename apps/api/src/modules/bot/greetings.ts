const GREETING_WORDS = ['hola', 'buen dia', 'buen día', 'buenas', 'buenas tardes', 'buenas noches', 'hello', 'hi'];

export function isGreetingOnly(message: string) {
  const normalized = message.trim().toLowerCase();
  return GREETING_WORDS.includes(normalized);
}

export function looksLikeName(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return false;
  const words = trimmed.split(/\s+/);
  if (words.length > 4) return false;
  if (/\d/.test(trimmed)) return false;
  const lowered = trimmed.toLowerCase();
  if (GREETING_WORDS.includes(lowered)) return false;
  return true;
}
