import type { ConversationState, CreateLeadInput } from '@reaa/shared';
import { createLead } from './service.js';

export function canCreateLead(state: ConversationState) {
  if (state.leadCreated) return false;
  if (!state.selectedPropertyId) return false;
  if (!['buy', 'rent_residential', 'rent_commercial', 'ask_price'].includes(state.intent)) return false;
  return true;
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
    conversationSummary: buildConversationSummary(state),
    humanHandoffRequested: true,
    operationType: state.intent === 'buy' ? 'sale' : 'rent',
    zone: typeof state.collectedData.zone === 'string' ? state.collectedData.zone : undefined,
    budgetMax: typeof state.collectedData.budget === 'number' ? state.collectedData.budget : undefined,
  };

  return createLead(leadPayload);
}

function buildConversationSummary(state: ConversationState) {
  const parts = [
    `Intent: ${state.intent}`,
    typeof state.collectedData.zone === 'string' ? `Zona: ${state.collectedData.zone}` : null,
    typeof state.collectedData.budget === 'number' ? `Presupuesto: ${state.collectedData.budget}` : null,
    state.selectedPropertyId ? `Property: ${state.selectedPropertyId}` : null,
  ].filter(Boolean);

  return parts.join(' | ');
}
