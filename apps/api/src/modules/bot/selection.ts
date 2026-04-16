import type { ConversationState } from '@reaa/shared';
import { parseAffirmative, parseOrdinalSelection } from './parsers.js';

export function detectSelectedPropertyId(state: ConversationState, message: string): number | null {
  const text = message.toLowerCase();
  const candidates = state.candidatePropertyIds ?? [];
  if (!candidates.length) return null;

  const ordinal = parseOrdinalSelection(message);
  if (ordinal && candidates[ordinal - 1]) {
    return candidates[ordinal - 1];
  }

  const explicitId = message.match(/#?(\d{3,})/);
  if (explicitId) {
    const parsed = Number(explicitId[1]);
    if (candidates.includes(parsed)) {
      return parsed;
    }
  }

  if (
    text.includes('quiero ver') ||
    text.includes('quiero visitar') ||
    text.includes('pasame info') ||
    text.includes('esa me gusta') ||
    parseAffirmative(message)
  ) {
    return candidates[0] ?? null;
  }

  return null;
}
