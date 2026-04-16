import type { PropertyResult } from '@reaa/shared';

export function formatPropertyReply(results: PropertyResult[]): string {
  if (!results.length) {
    return 'Ya tomé nota de tu búsqueda. En breve un asesor te va a ayudar con opciones que se ajusten a lo que necesitás.';
  }

  const lines = results.slice(0, 3).map((property, index) => {
    const location = [property.neighborhood, property.district, property.region].filter(Boolean).join(', ');
    const extras = [
      typeof property.rooms === 'number' ? `${property.rooms} amb.` : null,
      typeof property.bedrooms === 'number' ? `${property.bedrooms} dorm.` : null,
      typeof property.bathrooms === 'number' ? `${property.bathrooms} baño(s)` : null,
      typeof property.coveredSquareMeters === 'number' ? `${property.coveredSquareMeters} m²` : null,
      property.garage ? 'cochera' : null,
      property.mortgageEligible ? 'apto crédito' : null,
    ].filter(Boolean).join(' · ');

    return `${index + 1}. ${property.propType ?? 'Propiedad'} en ${location} — ${property.currencyId ?? ''} ${property.price ?? ''}${extras ? ` · ${extras}` : ''}`;
  });

  return `Te comparto hasta 3 opciones que podrían servirte:\n${lines.join('\n')}\n\nSi querés, decime cuál te interesa más y seguimos por esa.`;
}
