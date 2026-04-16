import type { IntentType } from '@reaa/shared';

export function extractStructuredData(intent: IntentType, message: string): Record<string, unknown> {
  const text = message.toLowerCase();
  const result: Record<string, unknown> = {};

  const phoneMatch = message.match(/(\+?\d[\d\s\-]{7,})/);
  if (phoneMatch) {
    result.phone = phoneMatch[1].trim();
  }

  const budgetMatch = message.match(/(\d{2,})(\s?mil|\s?000|\s?usd|\s?u\$s)?/i);
  if (budgetMatch && ['buy', 'rent_residential', 'rent_commercial', 'rent_temporary', 'ask_price'].includes(intent)) {
    const raw = budgetMatch[0].replace(/[^\d]/g, '');
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      result.budget = parsed;
    }
  }

  if (text.includes('caballito')) result.zone = 'Caballito';
  if (text.includes('palermo')) result.zone = 'Palermo';
  if (text.includes('belgrano')) result.zone = 'Belgrano';

  if (text.includes('2 ambientes') || text.includes('dos ambientes')) result.people_or_rooms = '2 ambientes';
  if (text.includes('3 ambientes') || text.includes('tres ambientes')) result.people_or_rooms = '3 ambientes';
  if (text.includes('2 dormitorios')) result.people_or_rooms = '2 dormitorios';

  if (text.includes('mascota') || text.includes('perro') || text.includes('gato')) result.pets = true;
  if (text.includes('escritura')) result.has_deed = true;

  return result;
}
