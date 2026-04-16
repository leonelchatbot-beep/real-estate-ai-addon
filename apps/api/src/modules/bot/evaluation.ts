import type { ConversationState } from '@reaa/shared';
import { getMissingQuestions } from './stateMachine.js';

export function evaluationSafe(state: ConversationState) {
  return getMissingQuestions(state.intent, state.collectedData);
}
