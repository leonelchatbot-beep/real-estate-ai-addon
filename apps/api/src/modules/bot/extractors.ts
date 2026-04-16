import type { IntentType, RequiredQuestionKey } from '@reaa/shared';
import { parseAffirmative } from './parsers.js';
import { normalizeName, normalizePhone, normalizeZone } from './normalizers.js';

function tryExtractByQuestion(question: RequiredQuestionKey | null, message: string): Record<string, unknown> {
  if (!question) return {};

  switch (question) {
    case 'name':
      return { name: normalizeName(message) };
    case 'phone':
      return { phone: normalizePhone(message) };
    case 'zone':
      return { zone: normalizeZone(message) };
    case 'budget': {
      const raw = message.replace(/[^\d]/g, '');
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? { budget: parsed } : {};
    }
    case 'people_or_rooms':
      return { people_or_rooms: message.trim() };
    case 'income_requirements':
      return { income_requirements: message.trim() };
    case 'pets':
      return { pets: parseAffirmative(message) ? 'sí' : message.trim() };
    case 'commercial_use':
      return { commercial_use: message.trim() };
    case 'dates':
      return { dates: message.trim() };
    case 'address':
      return { address: message.trim() };
    case 'has_deed':
      return { has_deed: parseAffirmative(message) ? 'sí' : message.trim() };
    case 'property_age':
      return { property_age: message.trim() };
    case 'rooms':
      return { rooms: message.trim() };
    case 'previous_valuation':
      return { previous_valuation: message.trim() };
    default:
      return {};
  }
}

export function extractStructuredData(intent: IntentType, message: string, currentQuestion: RequiredQuestionKey | null): Record<string, unknown> {
  const direct = tryExtractByQuestion(currentQuestion, message);
  if (Object.keys(direct).length > 0) {
    return direct;
  }

  const text = message.toLowerCase();
  const result: Record<string, unknown> = {};

  const phoneMatch = message.match(/(\+?\d[\d\s\-]{7,})/);
  if (phoneMatch) {
    result.phone = normalizePhone(phoneMatch[1]);
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
  if (text.includes('la plata')) result.zone = 'La Plata';

  if (text.includes('2 ambientes') || text.includes('dos ambientes')) result.people_or_rooms = '2 ambientes';
  if (text.includes('3 ambientes') || text.includes('tres ambientes')) result.people_or_rooms = '3 ambientes';
  if (text.includes('2 dormitorios')) result.people_or_rooms = '2 dormitorios';

  if (text.includes('mascota') || text.includes('perro') || text.includes('gato')) result.pets = 'sí';
  if (text.includes('escritura')) result.has_deed = 'sí';
  if (parseAffirmative(message) && currentQuestion === 'has_deed') result.has_deed = 'sí';
  if (parseAffirmative(message) && currentQuestion === 'pets') result.pets = 'sí';

  return result;
}
