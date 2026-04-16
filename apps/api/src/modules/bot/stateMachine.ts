import {
  DEFAULT_INTENT_TAGS,
  INTENT_REQUIRED_QUESTIONS,
  QUESTION_PROMPTS,
  type ConversationState,
  type IntentType,
  type LeadTag,
  type NextQuestionResult,
  type RequiredQuestionKey,
} from '@reaa/shared';

export function inferTags(intent: IntentType, channel: string): LeadTag[] {
  const base = DEFAULT_INTENT_TAGS[intent] ?? ['unknown'];
  const channelTag = channel === 'webchat' || channel === 'instagram' || channel === 'whatsapp'
    ? [channel as LeadTag]
    : [];
  return [...new Set([...base, ...channelTag])];
}

export function getMissingQuestions(intent: IntentType, collectedData: Record<string, unknown>): RequiredQuestionKey[] {
  const required = INTENT_REQUIRED_QUESTIONS[intent] ?? [];
  return required.filter((question) => !(question in collectedData));
}

export function getNextQuestion(state: ConversationState): NextQuestionResult {
  const missingQuestions = getMissingQuestions(state.intent, state.collectedData);
  return {
    missingQuestions,
    nextQuestion: missingQuestions[0] ?? null,
  };
}

export function buildReplyPreview(state: ConversationState): string {
  const next = getNextQuestion(state);
  if (next.nextQuestion) {
    return QUESTION_PROMPTS[next.nextQuestion];
  }

  return 'Perfecto. Ya tengo la info principal para avanzar con la búsqueda o dejar el lead listo para un asesor.';
}
