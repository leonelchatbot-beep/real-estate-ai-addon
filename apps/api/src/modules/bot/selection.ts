import type { ConversationState } from '@reaa/shared';

export function detectSelectedPropertyId(state: ConversationState, message: string): number | null {
  const text = message.toLowerCase();
  const candidates = state.candidatePropertyIds ?? [];
  if (!candidates.length) return null;

  const ordinalMap: Record<string, number> = {
    '1': 0,
    '2': 1,
    '3': 2,
    'primera': 0,
    'primero': 0,
    'segunda': 1,
    'segundo': 1,
    'tercera': 2,
    'tercero': 2,
  };

  for (const [key, index] of Object.entries(ordinalMap)) {
    if (text.includes(key) && candidates[index]) {
      return candidates[index];
    }
  }

  const explicitId = message.match(/#?(\d{3,})/);
  if (explicitId) {
    const parsed = Number(explicitId[1]);
    if (candidates.includes(parsed)) {
      return parsed;
    }
  }

  if (
    text.includes('me interesa') ||
    text.includes('quiero ver') ||
    text.includes('quiero visitar') ||
    text.includes('pasame info') ||
    text.includes('esa me gusta')
  ) {
    return candidates[0] ?? null;
  }

  return null;
}
