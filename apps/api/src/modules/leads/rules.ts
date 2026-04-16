import type { ConversationState } from '@reaa/shared';

export function hasMinimumLeadContactData(state: ConversationState) {
  const data = state.collectedData;
  return typeof data.phone === 'string' && data.phone.trim().length >= 8;
}

export function shouldCreateLeadNow(state: ConversationState) {
  if (state.leadCreated) return false;
  if (!state.selectedPropertyId) return false;
  if (!['buy', 'rent_residential', 'rent_commercial', 'ask_price'].includes(state.intent)) return false;
  return hasMinimumLeadContactData(state);
}
