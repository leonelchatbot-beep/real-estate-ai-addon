import type { ConversationState, IntentType } from '@reaa/shared';
import { buildReplyPreview, getNextQuestion, inferTags } from './stateMachine.js';
import { inferCurrentQuestion } from './context.js';
import { extractStructuredData } from './extractors.js';

export function detectIntent(message: string): IntentType {
  const text = message.toLowerCase();
  if (text.includes('vender') || text.includes('tasar')) return 'seller';
  if (text.includes('asesor') || text.includes('sumarme')) return 'recruiting';
  if (text.includes('temporal') || text.includes('amoblado')) return 'rent_temporary';
  if (text.includes('local') || text.includes('comercio')) return 'rent_commercial';
  if (text.includes('alquilar') || text.includes('alquiler')) return 'rent_residential';
  if (text.includes('precio') || text.includes('info') || text.includes('información')) return 'ask_price';
  if (text.includes('comprar') || text.includes('compra')) return 'buy';
  return 'unknown';
}

export function evaluateConversation(state: ConversationState) {
  const next = getNextQuestion(state);
  const tags = inferTags(state.intent, state.channel);
  const replyPreview = buildReplyPreview({ ...state, tags });

  return {
    intent: state.intent,
    tags,
    nextQuestion: next.nextQuestion,
    missingQuestions: next.missingQuestions,
    replyPreview,
    qualifiesForLead: next.missingQuestions.length === 0,
  };
}

export function evolveConversationState(current: ConversationState, message: string): ConversationState {
  const currentQuestion = inferCurrentQuestion(current);
  const extractedData = extractStructuredData(current.intent, message, currentQuestion);

  const nextCollectedData = {
    ...current.collectedData,
    ...extractedData,
  };

  const detectedIntent = current.intent === 'unknown' ? detectIntent(message) : current.intent;

  return {
    ...current,
    intent: detectedIntent,
    collectedData: nextCollectedData,
    tags: inferTags(detectedIntent, current.channel),
  };
}
