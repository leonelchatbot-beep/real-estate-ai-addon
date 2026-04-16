import type { ConversationState, RequiredQuestionKey } from '@reaa/shared';
import { buildIntentDetectedMessage, buildQuestionCopy } from './copy.js';
import { buildHandoffMessage } from './handoff.js';
import { setLastAskedQuestion } from './context.js';

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

  if (state.intent === 'seller' || state.intent === 'recruiting' || state.intent === 'rent_temporary' || state.intent === 'existing_customer') {
    if (!nextQuestion) {
      return buildHandoffMessage(state.intent);
    }
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
