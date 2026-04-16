import type { ConversationState, PropertySearchInput } from '@reaa/shared';
import { searchProperties } from '../properties/service.js';
import { getMissingQuestions } from './stateMachine.js';
import { shouldOfferProperties } from './rules.js';
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
  const missingQuestions = getMissingQuestions(state.intent, state.collectedData);
  if (!shouldOfferProperties(state.intent, missingQuestions)) {
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
