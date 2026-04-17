import type { ConversationState } from '@reaa/shared';
import { inferCurrentQuestion } from './context.js';
import { isGreetingOnly, looksLikeName } from './greetings.js';
import { normalizeName } from './normalizers.js';

export function forceCaptureNameIfApplicable(state: ConversationState, message: string): ConversationState {
  const currentQuestion = inferCurrentQuestion(state);
  if (currentQuestion !== 'name') return state;
  if (state.collectedData.name) return state;
  if (isGreetingOnly(message)) return state;
  if (!looksLikeName(message)) return state;

  return {
    ...state,
    collectedData: {
      ...state.collectedData,
      name: normalizeName(message),
    },
  };
}
