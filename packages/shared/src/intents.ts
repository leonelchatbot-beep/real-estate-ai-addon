export type IntentType =
  | 'buy'
  | 'rent_residential'
  | 'rent_commercial'
  | 'rent_temporary'
  | 'seller'
  | 'ask_price'
  | 'recruiting'
  | 'existing_customer'
  | 'unknown';

export type RequiredQuestionKey =
  | 'name'
  | 'phone'
  | 'zone'
  | 'people_or_rooms'
  | 'budget'
  | 'income_requirements'
  | 'pets'
  | 'commercial_use'
  | 'dates'
  | 'address'
  | 'has_deed'
  | 'property_age'
  | 'rooms'
  | 'previous_valuation';

export const INTENT_REQUIRED_QUESTIONS: Record<IntentType, RequiredQuestionKey[]> = {
  buy: ['zone', 'people_or_rooms', 'budget', 'phone'],
  rent_residential: ['zone', 'people_or_rooms', 'budget', 'income_requirements', 'pets'],
  rent_commercial: ['zone', 'commercial_use', 'budget', 'income_requirements'],
  rent_temporary: ['zone', 'people_or_rooms', 'budget', 'dates', 'pets'],
  seller: ['address', 'has_deed', 'property_age', 'rooms', 'previous_valuation', 'phone'],
  ask_price: ['zone', 'people_or_rooms', 'budget'],
  recruiting: ['name'],
  existing_customer: [],
  unknown: [],
};
