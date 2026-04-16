import type { ConversationState, PropertySearchInput } from '@reaa/shared';
import { searchProperties } from '../properties/service.js';
import { formatPropertyReply } from '../properties/presenter.js';

function inferOperationType(intent: ConversationState['intent']): string | undefined {
  if (intent === 'buy') return 'sale';
  if (intent === 'rent_residential' || intent === 'rent_commercial' || intent === 'rent_temporary') return 'rent';
  return undefined;
}

function inferSearchInput(state: ConversationState): PropertySearchInput {
  const data = state.collectedData;
  return {
    orgId: state.orgId,
    operationType: inferOperationType(state.intent),
    zone: typeof data.zone === 'string' ? data.zone : undefined,
    budgetMax: typeof data.budget === 'number' ? data.budget : undefined,
    limit: 3,
  };
}

export async function maybeBuildPropertySuggestion(state: ConversationState) {
  if (!['buy', 'rent_residential', 'rent_commercial', 'ask_price'].includes(state.intent)) {
    return null;
  }

  const hasZone = typeof state.collectedData.zone === 'string';
  const hasBudget = typeof state.collectedData.budget === 'string' || typeof state.collectedData.budget === 'number';

  if (!hasZone || !hasBudget) {
    return null;
  }

  const searchInput = inferSearchInput(state);
  const results = await searchProperties(searchInput);

  return {
    results,
    candidatePropertyIds: results.map((property) => property.propertyId),
    reply: formatPropertyReply(results),
  };
}
