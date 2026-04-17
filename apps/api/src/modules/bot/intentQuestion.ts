import type { ConversationState } from '@reaa/shared';

export function needsIntentQuestion(state: ConversationState) {
  return state.intent === 'unknown' && Boolean(state.collectedData.name);
}

export function buildIntentQuestion() {
  return 'Un gusto. ¿Estás buscando para comprar, alquilar, vender una propiedad o sumarte como asesor?';
}
