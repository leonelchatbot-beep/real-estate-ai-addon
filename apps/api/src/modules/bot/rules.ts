import type { IntentType, RequiredQuestionKey } from '@reaa/shared';

export function shouldOfferProperties(intent: IntentType, missingQuestions: RequiredQuestionKey[]) {
  if (!['buy', 'rent_residential', 'rent_commercial', 'ask_price'].includes(intent)) {
    return false;
  }

  return missingQuestions.length === 0;
}

export function shouldAutoDerive(intent: IntentType, missingQuestions: RequiredQuestionKey[]) {
  if (intent === 'seller' || intent === 'recruiting' || intent === 'existing_customer' || intent === 'rent_temporary') {
    return missingQuestions.length === 0;
  }

  return false;
}
