import type { ConversationState } from '@reaa/shared';
import { createLead } from './service.js';
import { buildLeadPayloadFromState } from './payload.js';
import { shouldCreateLeadNow } from './rules.js';

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

  const leadPayload = buildLeadPayloadFromState({ state, sessionId });

  return createLead(leadPayload);
}
