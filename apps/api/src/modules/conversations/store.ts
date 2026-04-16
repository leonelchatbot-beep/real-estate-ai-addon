import type { ConversationState, FollowUpStatus } from '@reaa/shared';

interface StoredSession {
  sessionId: string;
  orgId: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  sourceUrl?: string;
  referrerUrl?: string;
  landingUrl?: string;
  userAgent?: string;
  state: ConversationState;
  followUpStatus: FollowUpStatus;
  lastInboundAt?: string;
  lastOutboundAt?: string;
  nextFollowUpAt?: string;
  messages: Array<{
    id: string;
    direction: 'inbound' | 'outbound';
    content: string;
    createdAt: string;
  }>;
}

const sessions = new Map<string, StoredSession>();

export function saveSession(session: StoredSession) {
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function getAllSessions() {
  return Array.from(sessions.values());
}

export function updateSession(sessionId: string, updater: (session: StoredSession) => StoredSession) {
  const current = sessions.get(sessionId);
  if (!current) return null;
  const updated = updater(current);
  sessions.set(sessionId, updated);
  return updated;
}
