import type { ConversationState, CreateLeadInput } from '@reaa/shared';
import { buildLeadSummary } from './summary.js';

export function buildLeadPayloadFromState(params: {
  state: ConversationState;
  sessionId: string;
}): CreateLeadInput {
  const { state, sessionId } = params;

  return {
    orgId: state.orgId,
    propertyId: state.selectedPropertyId ?? undefined,
    sessionId,
    contactName: typeof state.collectedData.name === 'string' ? state.collectedData.name : undefined,
    contactPhone: typeof state.collectedData.phone === 'string' ? state.collectedData.phone : undefined,
    message: buildLeadSummary(state),
    source: state.channel,
    channel: state.channel as CreateLeadInput['channel'],
    leadType: state.intent,
    conversationSummary: buildLeadSummary(state),
    humanHandoffRequested: true,
    operationType: state.intent === 'buy' ? 'sale' : 'rent',
    zone: typeof state.collectedData.zone === 'string' ? state.collectedData.zone : undefined,
    budgetMax: typeof state.collectedData.budget === 'number' ? state.collectedData.budget : undefined,
  };
}
