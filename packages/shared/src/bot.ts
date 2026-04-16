import type { IntentType, RequiredQuestionKey } from './intents.js';

export interface ConversationState {
  orgId: string;
  channel: string;
  intent: IntentType;
  collectedData: Record<string, unknown>;
  tags: string[];
  candidatePropertyIds?: number[];
  selectedPropertyId?: number | null;
}

export interface NextQuestionResult {
  missingQuestions: RequiredQuestionKey[];
  nextQuestion: RequiredQuestionKey | null;
}
