import type { ConversationState, RequiredQuestionKey } from '@reaa/shared';
import { setLastAskedQuestion } from './context.js';

export function attachNextQuestionToState(state: ConversationState, nextQuestion: RequiredQuestionKey | null) {
  return setLastAskedQuestion(state, nextQuestion);
}
