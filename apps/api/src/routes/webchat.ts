import type { FastifyInstance } from 'fastify';
import type { WebchatMessageRequest, WebchatSessionRequest } from '@reaa/shared';
import {
  appendBotReply,
  createMessage,
  createSession,
  readSession,
  updateConversationState,
} from '../modules/conversations/service.js';
import { maybeBuildPropertySuggestion } from '../modules/bot/propertyFlow.js';
import { shouldAutoDerive } from '../modules/bot/rules.js';
import { detectSelectedPropertyId } from '../modules/bot/selection.js';
import { forceCaptureNameIfApplicable } from '../modules/bot/nameCapture.js';
import { evaluationSafe } from '../modules/bot/evaluation.js';
import { evaluateConversation, evolveConversationState } from '../modules/bot/service.js';
import { getOrgBotConfig } from '../modules/config/store.js';
import { maybeCreateLeadFromConversation } from '../modules/leads/trigger.js';
import { assertObject, optionalString, requireString } from '../lib/validators.js';
import { buildNaturalReply } from '../modules/bot/replyBuilder.js';
import { summarizeState } from '../modules/bot/debug.js';
import { attachNextQuestionToState } from '../modules/bot/nextState.js';
import { buildWelcomeMessage } from '../modules/bot/copy.js';

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

      const session = await createSession({ ...payload, channel: 'webchat' });
      const botConfig = getOrgBotConfig(payload.orgId);
      const welcomeMessage = buildWelcomeMessage(botConfig.assistantName, botConfig.agencyName);
      await appendBotReply(session.sessionId, welcomeMessage);
      return {
        ...session,
        welcomeMessage,
      };
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });

  app.post('/webchat/message', async (request, reply) => {
    try {
      const body = assertObject(request.body) as Record<string, unknown>;
      const payload: WebchatMessageRequest = {
        orgId: requireString(body.orgId, 'orgId'),
        sessionId: requireString(body.sessionId, 'sessionId'),
        message: requireString(body.message, 'message'),
        channel: 'webchat',
      };

      const sessionId = payload.sessionId!;
      const existingSession = readSession(sessionId);
      if (!existingSession) {
        return reply.code(404).send({ ok: false, error: 'session not found' });
      }

      const stored = await createMessage({ ...payload, sessionId } as unknown as Record<string, unknown>);
      let nextState = evolveConversationState(existingSession.state, payload.message);
      nextState = forceCaptureNameIfApplicable(nextState, payload.message);
      const detectedSelection = detectSelectedPropertyId(nextState, payload.message);
      if (detectedSelection) {
        nextState = {
          ...nextState,
          selectedPropertyId: detectedSelection,
        };
      }

      const suggestion = await maybeBuildPropertySuggestion(nextState);

      if (suggestion) {
        nextState = {
          ...nextState,
          candidatePropertyIds: suggestion.candidatePropertyIds,
        };
      }

      let leadResult = null;
      if (nextState.selectedPropertyId) {
        leadResult = await maybeCreateLeadFromConversation({
          state: nextState,
          sessionId,
        });

        if (leadResult?.leadId) {
          nextState = {
            ...nextState,
            leadCreated: true,
            leadId: leadResult.leadId,
          };
        }
      }

      const shouldDerive = shouldAutoDerive(nextState.intent, evaluationSafe(nextState));

      const evaluation = evaluateConversation(nextState);
      const questionForState = nextState.intent === 'unknown' && nextState.collectedData.name ? null : evaluation.nextQuestion;
      nextState = attachNextQuestionToState(nextState, questionForState);
      updateConversationState(sessionId, nextState);
      const finalReply = shouldDerive
        ? buildNaturalReply({
            state: nextState,
            nextQuestion: null,
            suggestionReply: null,
            leadCreated: false,
          })
        : buildNaturalReply({
            state: nextState,
            nextQuestion: evaluation.nextQuestion,
            suggestionReply: suggestion?.reply ?? null,
            leadCreated: Boolean(leadResult?.leadId),
          });
      await appendBotReply(sessionId, finalReply);

      return {
        ok: true,
        stored,
        intent: evaluation.intent,
        nextQuestion: evaluation.nextQuestion,
        missingQuestions: evaluation.missingQuestions,
        tags: evaluation.tags,
        replyPreview: finalReply,
        qualifiesForLead: evaluation.qualifiesForLead,
        collectedData: nextState.collectedData,
        candidatePropertyIds: nextState.candidatePropertyIds ?? [],
        selectedPropertyId: nextState.selectedPropertyId ?? null,
        leadCreated: nextState.leadCreated ?? false,
        leadId: nextState.leadId ?? null,
        debugState: summarizeState(nextState),
      };
    } catch (error) {
      return reply.code(400).send({ ok: false, error: (error as Error).message });
    }
  });
}
