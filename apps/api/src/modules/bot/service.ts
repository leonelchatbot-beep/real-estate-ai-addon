import { INTENT_REQUIRED_QUESTIONS, type ConversationState, type IntentType, type NextQuestionResult } from '@reaa/shared';

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

export function getNextQuestion(state: ConversationState): NextQuestionResult {
  const required = INTENT_REQUIRED_QUESTIONS[state.intent] ?? [];
  const missingQuestions = required.filter((question) => !(question in state.collectedData));
  return {
    missingQuestions,
    nextQuestion: missingQuestions[0] ?? null,
  };
}
