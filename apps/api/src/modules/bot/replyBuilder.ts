import type { ConversationState, RequiredQuestionKey } from '@reaa/shared';
import { buildIntentDetectedMessage, buildQuestionCopy } from './copy.js';

export function buildNaturalReply(params: {
  state: ConversationState;
  nextQuestion: RequiredQuestionKey | null;
  suggestionReply?: string | null;
  leadCreated?: boolean;
}) {
  const { state, nextQuestion, suggestionReply, leadCreated } = params;

  if (leadCreated) {
    return 'Perfecto. Ya tomé tu consulta sobre esa propiedad y un asesor se va a contactar con vos a la brevedad.';
  }

  if (suggestionReply) {
    return suggestionReply;
  }

  if (nextQuestion) {
    const intro = buildIntentDetectedMessage(state.intent);
    const question = buildQuestionCopy(nextQuestion);
    return `${intro} ${question}`;
  }

  return 'Perfecto. Ya tengo la info principal para seguir con la búsqueda o derivarte con un asesor.';
}
