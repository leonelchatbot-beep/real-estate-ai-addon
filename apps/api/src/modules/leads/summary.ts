import type { ConversationState } from '@reaa/shared';

function intentLabel(intent: ConversationState['intent']) {
  switch (intent) {
    case 'buy':
      return 'Comprador';
    case 'rent_residential':
      return 'Cliente buscando alquiler tradicional';
    case 'rent_commercial':
      return 'Cliente buscando local o comercio';
    case 'rent_temporary':
      return 'Cliente buscando alquiler temporal';
    case 'seller':
      return 'Propietario interesado en vender';
    case 'ask_price':
      return 'Consulta por precio o información';
    case 'recruiting':
      return 'Consulta para sumarse como asesor';
    default:
      return 'Consulta general';
  }
}

export function buildLeadSummary(state: ConversationState) {
  const parts: string[] = [intentLabel(state.intent)];

  const data = state.collectedData;

  if (typeof data.name === 'string') parts.push(`Nombre: ${data.name}`);
  if (typeof data.phone === 'string') parts.push(`Tel: ${data.phone}`);
  if (typeof data.zone === 'string') parts.push(`Zona: ${data.zone}`);
  if (typeof data.people_or_rooms === 'string') parts.push(`Búsqueda: ${data.people_or_rooms}`);
  if (typeof data.budget === 'number') parts.push(`Presupuesto: ${data.budget}`);
  if (typeof data.pets === 'string' || typeof data.pets === 'boolean') parts.push(`Mascotas: ${data.pets}`);
  if (typeof data.commercial_use === 'string') parts.push(`Rubro: ${data.commercial_use}`);
  if (typeof data.dates === 'string') parts.push(`Fechas: ${data.dates}`);
  if (typeof data.address === 'string') parts.push(`Dirección: ${data.address}`);
  if (typeof data.has_deed === 'string') parts.push(`Escritura: ${data.has_deed}`);
  if (typeof data.property_age === 'string') parts.push(`Antigüedad: ${data.property_age}`);
  if (typeof data.rooms === 'string') parts.push(`Ambientes: ${data.rooms}`);
  if (typeof data.previous_valuation === 'string') parts.push(`Tasación previa: ${data.previous_valuation}`);
  if (state.selectedPropertyId) parts.push(`Propiedad elegida: ${state.selectedPropertyId}`);

  return parts.join(' | ');
}
