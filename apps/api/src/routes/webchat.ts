import type { FastifyInstance } from 'fastify';
import { createMessage, createSession } from '../modules/conversations/service.js';
import { detectIntent, getNextQuestion } from '../modules/bot/service.js';

export async function webchatRoutes(app: FastifyInstance) {
  app.post('/webchat/session', async (request) => {
    return createSession((request.body as Record<string, unknown>) ?? {});
  });

  app.post('/webchat/message', async (request) => {
    const body = (request.body as Record<string, unknown>) ?? {};
    const message = typeof body.message === 'string' ? body.message : '';
    const intent = detectIntent(message);
    const state = {
      orgId: String(body.orgId ?? ''),
      channel: 'webchat',
      intent,
      collectedData: {},
      tags: [],
    };
    const next = getNextQuestion(state);
    const stored = await createMessage(body);
    return {
      ok: true,
      stored,
      intent,
      nextQuestion: next.nextQuestion,
      missingQuestions: next.missingQuestions,
    };
  });
}
