import type { PropertyResult, PropertySearchInput } from '@reaa/shared';

const MOCK_PROPERTIES: Omit<PropertyResult, 'sourceScope'>[] = [
  {
    propertyId: 1001,
    orgId: 'demo-org',
    orgName: 'Demo Org',
    propType: 'apartment',
    operationType: 'sale',
    district: 'Capital Federal',
    neighborhood: 'Caballito',
    region: 'Buenos Aires',
    currencyId: 'USD',
    price: 138000,
    coveredSquareMeters: 68,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    garage: false,
    mortgageEligible: true,
  },
  {
    propertyId: 1002,
    orgId: 'demo-org',
    orgName: 'Demo Org',
    propType: 'apartment',
    operationType: 'sale',
    district: 'Capital Federal',
    neighborhood: 'Caballito',
    region: 'Buenos Aires',
    currencyId: 'USD',
    price: 145000,
    coveredSquareMeters: 72,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    garage: true,
    mortgageEligible: false,
  },
  {
    propertyId: 2001,
    orgId: 'other-org',
    orgName: 'Other Org',
    propType: 'apartment',
    operationType: 'sale',
    district: 'Capital Federal',
    neighborhood: 'Caballito',
    region: 'Buenos Aires',
    currencyId: 'USD',
    price: 132000,
    coveredSquareMeters: 65,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    garage: false,
    mortgageEligible: true,
  },
];

function matches(input: PropertySearchInput, property: Omit<PropertyResult, 'sourceScope'>) {
  if (input.operationType && property.operationType !== input.operationType) return false;
  if (input.propType && property.propType !== input.propType) return false;
  if (input.currencyId && property.currencyId !== input.currencyId) return false;
  if (typeof input.budgetMin === 'number' && typeof property.price === 'number' && property.price < input.budgetMin) return false;
  if (typeof input.budgetMax === 'number' && typeof property.price === 'number' && property.price > input.budgetMax) return false;
  if (typeof input.rooms === 'number' && typeof property.rooms === 'number' && property.rooms < input.rooms) return false;
  if (typeof input.bedrooms === 'number' && typeof property.bedrooms === 'number' && property.bedrooms < input.bedrooms) return false;
  if (typeof input.bathrooms === 'number' && typeof property.bathrooms === 'number' && property.bathrooms < input.bathrooms) return false;
  if (typeof input.garage === 'boolean' && property.garage !== input.garage) return false;
  if (typeof input.mortgageEligible === 'boolean' && property.mortgageEligible !== input.mortgageEligible) return false;
  if (input.zone) {
    const zone = input.zone.toLowerCase();
    const haystack = [property.neighborhood, property.district, property.region].filter(Boolean).join(' ').toLowerCase();
    if (!haystack.includes(zone)) return false;
  }
  return true;
}

export async function searchProperties(input: PropertySearchInput): Promise<PropertyResult[]> {
  const limit = Math.min(input.limit ?? 3, 3);

  const officeResults = MOCK_PROPERTIES
    .filter((property) => property.orgId === input.orgId)
    .filter((property) => matches(input, property))
    .slice(0, limit)
    .map((property) => ({ ...property, sourceScope: 'office' as const }));

  if (officeResults.length >= limit) {
    return officeResults;
  }

  const globalNeeded = limit - officeResults.length;
  const globalResults = MOCK_PROPERTIES
    .filter((property) => property.orgId !== input.orgId)
    .filter((property) => matches(input, property))
    .slice(0, globalNeeded)
    .map((property) => ({ ...property, sourceScope: 'global' as const }));

  return [...officeResults, ...globalResults];
}
