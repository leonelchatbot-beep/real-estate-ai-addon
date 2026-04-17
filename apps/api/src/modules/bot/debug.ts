import type { ConversationState } from '@reaa/shared';

export function summarizeState(state: ConversationState) {
  return {
    intent: state.intent,
    collectedKeys: Object.keys(state.collectedData),
    name: state.collectedData.name ?? null,
    zone: state.collectedData.zone ?? null,
    budget: state.collectedData.budget ?? null,
    selectedPropertyId: state.selectedPropertyId ?? null,
  };
}
