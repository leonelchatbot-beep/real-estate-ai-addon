import type { IntentType, RequiredQuestionKey } from '@reaa/shared';

export function getGreetingByHour(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Buen día';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export function buildWelcomeMessage() {
  return `${getGreetingByHour()}. Soy Sunny, la asistente virtual de la inmobiliaria. Estoy para ayudarte con una respuesta rápida mientras coordinamos con un asesor del equipo. ¿Con quién tengo el gusto?`;
}

export function buildIntentDetectedMessage(intent: IntentType) {
  switch (intent) {
    case 'buy':
      return 'Perfecto, te ayudo con la búsqueda de compra.';
    case 'rent_residential':
      return 'Perfecto, te ayudo con la búsqueda de alquiler.';
    case 'rent_commercial':
      return 'Perfecto, te ayudo con la búsqueda de local o comercio.';
    case 'rent_temporary':
      return 'Perfecto, te ayudo con la búsqueda de alquiler temporal.';
    case 'seller':
      return 'Perfecto, te ayudo con la consulta para vender tu propiedad.';
    case 'ask_price':
      return 'Dale, te ayudo con la consulta de precio o información.';
    case 'recruiting':
      return 'Buenísimo, te cuento un poco y avanzamos con las preguntas para sumarte como asesor.';
    default:
      return 'Contame un poco más así te ayudo mejor.';
  }
}

export function buildQuestionCopy(question: RequiredQuestionKey): string {
  const map: Record<RequiredQuestionKey, string> = {
    name: '¿Con quién tengo el gusto?',
    phone: '¿Me pasás un teléfono de contacto así un asesor puede seguir con vos por esa propiedad?',
    zone: '¿Por qué zona estás buscando?',
    people_or_rooms: '¿Cuántos ambientes o dormitorios estás buscando?',
    budget: '¿Hasta cuánto de presupuesto estás manejando?',
    income_requirements: '¿Contás con ingresos demostrables, garantía propietaria, 3 garantes con recibo de sueldo o seguro de caución?',
    pets: '¿Tenés mascotas o necesitás que sea apto mascotas?',
    commercial_use: '¿Para qué rubro sería el local o comercio?',
    dates: '¿Cuándo te gustaría ingresar y por cuánto tiempo?',
    address: '¿Me pasás la dirección exacta y la localidad de la propiedad?',
    has_deed: '¿La propiedad tiene escritura?',
    property_age: '¿Qué antigüedad tiene la propiedad?',
    rooms: '¿Cuántos ambientes tiene la propiedad?',
    previous_valuation: '¿La propiedad fue tasada anteriormente por otra inmobiliaria?',
  };

  return map[question];
}
