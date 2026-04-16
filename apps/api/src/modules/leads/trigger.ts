import type { ConversationState, CreateLeadInput } from '@reaa/shared';
import { createLead } from './service.js';
import { shouldCreateLeadNow } from './rules.js';
import { buildLeadSummary } from './summary.js';

export function canCreateLead(state: ConversationState) {
  return shouldCreateLeadNow(state);
}

export async function maybeCreateLeadFromConversation(params: {
  state: ConversationState;
  sessionId: string;
}) {
  const { state, sessionId } = params;

  if (!canCreateLead(state)) {
    return null;
  }

  const leadPayload: CreateLeadInput = {
    orgId: state.orgId,
    propertyId: state.selectedPropertyId ?? undefined,
    sessionId,
    contactName: typeof state.collectedData.name === 'string' ? state.collectedData.name : undefined,
    contactPhone: typeof state.collectedData.phone === 'string' ? state.collectedData.phone : undefined,
    message: `Lead generado por conversación (${state.intent})`,
    source: state.channel,
    channel: state.channel as CreateLeadInput['channel'],
    leadType: state.intent,
    conversationSummary: buildLeadSummary(state),
    humanHandoffRequested: true,
    operationType: state.intent === 'buy' ? 'sale' : 'rent',
    zone: typeof state.collectedData.zone === 'string' ? state.collectedData.zone : undefined,
    budgetMax: typeof state.collectedData.budget === 'number' ? state.collectedData.budget : undefined,
  };

  return createLead(leadPayload);
}
