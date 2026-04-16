import type { IntentType } from './intents.js';

export type LeadTag =
  | 'buyer'
  | 'seller'
  | 'rent'
  | 'rent_temporary'
  | 'rent_commercial'
  | 'recruiting'
  | 'ask_price'
  | 'existing_customer'
  | 'interested'
  | 'needs_human'
  | 'has_pets'
  | 'webchat'
  | 'instagram'
  | 'whatsapp'
  | 'no_response'
  | 'unknown';

export const DEFAULT_INTENT_TAGS: Record<IntentType, LeadTag[]> = {
  buy: ['buyer', 'interested'],
  rent_residential: ['rent', 'interested'],
  rent_commercial: ['rent_commercial', 'interested'],
  rent_temporary: ['rent_temporary', 'interested'],
  seller: ['seller', 'needs_human'],
  ask_price: ['ask_price'],
  recruiting: ['recruiting'],
  existing_customer: ['existing_customer', 'needs_human'],
  unknown: ['unknown'],
};
