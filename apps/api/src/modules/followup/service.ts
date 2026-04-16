import { DEFAULT_FOLLOW_UP_CONFIG, type FollowUpConfig } from '@reaa/shared';
import { appendBotReply, readSession } from '../conversations/service.js';
import { getAllSessions, updateSession } from '../conversations/store.js';

function addHours(date: Date, hours: number) {
  const copy = new Date(date);
  copy.setHours(copy.getHours() + hours);
  return copy;
}

export function scheduleFirstFollowUp(sessionId: string, config: FollowUpConfig = DEFAULT_FOLLOW_UP_CONFIG) {
  return updateSession(sessionId, (current) => ({
    ...current,
    followUpStatus: 'waiting_first_followup',
    nextFollowUpAt: addHours(new Date(), config.firstFollowUpHours).toISOString(),
  }));
}

export function markResponded(sessionId: string) {
  return updateSession(sessionId, (current) => ({
    ...current,
    followUpStatus: 'responded',
    nextFollowUpAt: undefined,
  }));
}

export async function runDueFollowUps(config: FollowUpConfig = DEFAULT_FOLLOW_UP_CONFIG) {
  const now = new Date();
  const due = getAllSessions().filter((session) => session.nextFollowUpAt && new Date(session.nextFollowUpAt) <= now);

  const processed: Array<{ sessionId: string; action: string }> = [];

  for (const session of due) {
    if (session.followUpStatus === 'waiting_first_followup') {
      await appendBotReply(session.sessionId, 'Hola, ¿seguís interesado/a? Si querés, contame y sigo ayudándote con la búsqueda.');
      updateSession(session.sessionId, (current) => ({
        ...current,
        followUpStatus: 'waiting_second_followup',
        nextFollowUpAt: addHours(new Date(), config.secondFollowUpHours).toISOString(),
      }));
      processed.push({ sessionId: session.sessionId, action: 'first_followup_sent' });
      continue;
    }

    if (session.followUpStatus === 'waiting_second_followup') {
      await appendBotReply(session.sessionId, 'Te escribo nuevamente por si querés retomar la búsqueda. Si te interesa, decime y sigo por acá.');
      updateSession(session.sessionId, (current) => ({
        ...current,
        followUpStatus: config.markDiscardedAfterSecondNoReply ? 'discarded_no_response' : 'none',
        nextFollowUpAt: undefined,
      }));
      processed.push({ sessionId: session.sessionId, action: 'second_followup_sent' });
    }
  }

  return processed;
}

export function getFollowUpSnapshot(sessionId: string) {
  return readSession(sessionId);
}
