import type { ConversationState } from '@reaa/shared';
import { getSession, saveSession, updateSession } from './store.js';

export async function createSession(input: Record<string, unknown>) {
  const sessionId = crypto.randomUUID();
  const session = saveSession({
    sessionId,
    orgId: String(input.orgId ?? ''),
    channel: String(input.channel ?? 'webchat'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceUrl: typeof input.sourceUrl === 'string' ? input.sourceUrl : undefined,
    referrerUrl: typeof input.referrerUrl === 'string' ? input.referrerUrl : undefined,
    landingUrl: typeof input.landingUrl === 'string' ? input.landingUrl : undefined,
    userAgent: typeof input.userAgent === 'string' ? input.userAgent : undefined,
    state: {
      orgId: String(input.orgId ?? ''),
      channel: String(input.channel ?? 'webchat'),
      intent: 'unknown',
      collectedData: {},
      tags: ['webchat'],
    },
    followUpStatus: 'none',
    lastInboundAt: undefined,
    lastOutboundAt: undefined,
    nextFollowUpAt: undefined,
    messages: [],
  });

  return {
    sessionId: session.sessionId,
    created: true,
    createdAt: session.createdAt,
  };
}

export async function createMessage(input: Record<string, unknown>) {
  const sessionId = String(input.sessionId ?? '');
  const session = getSession(sessionId);

  if (!session) {
    throw new Error('session not found');
  }

  const message = {
    id: crypto.randomUUID(),
    direction: 'inbound' as const,
    content: String(input.message ?? ''),
    createdAt: new Date().toISOString(),
  };

  updateSession(sessionId, (current) => ({
    ...current,
    updatedAt: new Date().toISOString(),
    lastInboundAt: message.createdAt,
    followUpStatus: 'responded',
    nextFollowUpAt: undefined,
    messages: [...current.messages, message],
  }));

  return {
    messageId: message.id,
    accepted: true,
    createdAt: message.createdAt,
  };
}

export async function appendBotReply(sessionId: string, content: string) {
  const session = getSession(sessionId);
  if (!session) return null;

  const message = {
    id: crypto.randomUUID(),
    direction: 'outbound' as const,
    content,
    createdAt: new Date().toISOString(),
  };

  updateSession(sessionId, (current) => ({
    ...current,
    updatedAt: new Date().toISOString(),
    lastOutboundAt: message.createdAt,
    messages: [...current.messages, message],
  }));

  return message;
}

export function readSession(sessionId: string) {
  return getSession(sessionId);
}

export function updateConversationState(sessionId: string, state: ConversationState) {
  return updateSession(sessionId, (current) => ({
    ...current,
    updatedAt: new Date().toISOString(),
    state: {
      ...current.state,
      ...state,
    },
  }));
}
