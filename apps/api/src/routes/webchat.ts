import type { FastifyInstance } from 'fastify';
import type { ConversationState, WebchatMessageRequest, WebchatSessionRequest } from '@reaa/shared';
import { createMessage, createSession } from '../modules/conversations/service.js';
import { detectIntent, evaluateConversation } from '../modules/bot/service.js';
import { assertObject, optionalString, requireString } from '../lib/validators.js';

export async function webchatRoutes(app: FastifyInstance) {
  app.post('/webchat/session', async (request, reply) => {
    try {
      const body = assertObject(request.body) as Record<string, unknown>;
      const payload: WebchatSessionRequest = {
        orgId: requireString(body.orgId, 'orgId'),
        sourceUrl: optionalString(body.sourceUrl),
        referrerUrl: optionalString(body.referrerUrl),
        landingUrl: optionalString(body.landingUrl),
        userAgent: optionalString(body.userAgent),
      };

      return createSession(payload as unknown as Record<string, unknown>);
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });

  app.post('/webchat/message', async (request, reply) => {
    try {
      const body = assertObject(request.body) as Record<string, unknown>;
      const payload: WebchatMessageRequest = {
        orgId: requireString(body.orgId, 'orgId'),
        sessionId: optionalString(body.sessionId),
        message: requireString(body.message, 'message'),
        channel: 'webchat',
      };

      const intent = detectIntent(payload.message);
      const state: ConversationState = {
        orgId: payload.orgId,
        channel: payload.channel ?? 'webchat',
        intent,
        collectedData: {},
        tags: [],
      };

      const evaluation = evaluateConversation(state);
      const stored = await createMessage(payload as unknown as Record<string, unknown>);

      return {
        ok: true,
        stored,
        intent: evaluation.intent,
        nextQuestion: evaluation.nextQuestion,
        missingQuestions: evaluation.missingQuestions,
        tags: evaluation.tags,
        replyPreview: evaluation.replyPreview,
        qualifiesForLead: evaluation.qualifiesForLead,
      };
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });
}
