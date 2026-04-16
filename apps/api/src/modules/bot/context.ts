import type { ConversationState, RequiredQuestionKey } from '@reaa/shared';

export function inferCurrentQuestion(state: ConversationState): RequiredQuestionKey | null {
  const asked = state.collectedData.__lastAskedQuestion;
  return typeof asked === 'string' ? (asked as RequiredQuestionKey) : null;
}

export function setLastAskedQuestion(state: ConversationState, question: RequiredQuestionKey | null): ConversationState {
  return {
    ...state,
    collectedData: {
      ...state.collectedData,
      __lastAskedQuestion: question,
    },
  };
}
