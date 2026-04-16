import type { RequiredQuestionKey, IntentType } from './intents.js';

export const QUESTION_PROMPTS: Record<RequiredQuestionKey, string> = {
  name: '¿Con quién tengo el gusto?',
  phone: '¿Me pasás un teléfono de contacto así, si hace falta, un asesor puede comunicarse con vos?',
  zone: '¿Por qué zona estás buscando?',
  people_or_rooms: '¿Para cuántas personas es o cuántos ambientes / dormitorios buscás?',
  budget: '¿Hasta cuánto de presupuesto estás buscando?',
  income_requirements: '¿Contás con ingresos demostrables, garantía propietaria, 3 garantes con recibo de sueldo o seguro de caución?',
  pets: '¿Necesitás que sea apto mascotas o tenés mascotas?',
  commercial_use: '¿Para qué rubro sería el local o comercio?',
  dates: '¿Cuándo te gustaría ingresar y por cuánto tiempo?',
  address: '¿Me pasás la dirección exacta y localidad de la propiedad?',
  has_deed: '¿La propiedad tiene escritura?',
  property_age: '¿Qué antigüedad tiene la propiedad?',
  rooms: '¿Cuántos ambientes tiene la propiedad?',
  previous_valuation: '¿La propiedad ya fue tasada anteriormente por otra inmobiliaria?',
};

export const INTENT_LABELS: Record<IntentType, string> = {
  buy: 'compra',
  rent_residential: 'alquiler tradicional vivienda',
  rent_commercial: 'alquiler local/comercio',
  rent_temporary: 'alquiler temporal',
  seller: 'venta',
  ask_price: 'consulta de precio o información',
  recruiting: 'sumarse como asesor',
  existing_customer: 'cliente existente',
  unknown: 'consulta general',
};
