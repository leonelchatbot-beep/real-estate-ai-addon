import type { PropertyResult, PropertySearchInput } from '@reaa/shared';
import { env } from '../../lib/env.js';
import { getJson } from '../../lib/http.js';

interface SearchApiProperty {
  property_id: number;
  org_id: string | number;
  status?: string | null;
  addr_district?: string | null;
  addr_neighborhood?: string | null;
  addr_region?: string | null;
  currency_id?: string | number | null;
  price?: number | null;
  prop_type?: string | null;
  operation_type?: string | null;
  mortgage_eligible?: boolean | null;
  title?: string | null;
}

interface SearchApiResponse {
  data: SearchApiProperty[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

function mapProperty(property: SearchApiProperty, sourceScope: 'office' | 'global'): PropertyResult {
  return {
    propertyId: property.property_id,
    orgId: String(property.org_id),
    orgName: null,
    propType: property.prop_type ?? null,
    operationType: property.operation_type ?? null,
    district: property.addr_district ?? null,
    neighborhood: property.addr_neighborhood ?? null,
    region: property.addr_region ?? null,
    currencyId: property.currency_id != null ? String(property.currency_id) : null,
    price: property.price ?? null,
    coveredSquareMeters: null,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    garage: null,
    mortgageEligible: property.mortgage_eligible ?? null,
    sourceScope,
  };
}

function matches(input: PropertySearchInput, property: SearchApiProperty) {
  if (input.operationType && property.operation_type !== input.operationType) return false;
  if (input.propType && property.prop_type !== input.propType) return false;
  if (input.currencyId && String(property.currency_id ?? '') !== input.currencyId) return false;
  if (property.status && !['active', 'published', 'available'].includes(String(property.status).toLowerCase())) return false;
  if (typeof input.budgetMin === 'number' && typeof property.price === 'number' && property.price < input.budgetMin) return false;
  if (typeof input.budgetMax === 'number' && typeof property.price === 'number' && property.price > input.budgetMax) return false;
  if (input.zone) {
    const zone = input.zone.toLowerCase();
    const haystack = [property.addr_neighborhood, property.addr_district, property.addr_region].filter(Boolean).join(' ').toLowerCase();
    if (!haystack.includes(zone)) return false;
  }
  return true;
}

export async function searchPropertiesFromApi(input: PropertySearchInput): Promise<PropertyResult[]> {
  const url = new URL('/search/', env.apiBaseUrl);
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '100');

  const response = await getJson<SearchApiResponse>(url.toString(), {
    headers: {
      Authorization: `Bearer ${env.searchToken}`,
    },
  });

  const filtered = response.data.filter((property) => matches(input, property));
  const limit = Math.min(input.limit ?? 3, 3);

  const officeResults = filtered
    .filter((property) => String(property.org_id) === input.orgId)
    .slice(0, limit)
    .map((property) => mapProperty(property, 'office'));

  if (officeResults.length >= limit) {
    return officeResults;
  }

  const needed = limit - officeResults.length;
  const globalResults = filtered
    .filter((property) => String(property.org_id) !== input.orgId)
    .slice(0, needed)
    .map((property) => mapProperty(property, 'global'));

  return [...officeResults, ...globalResults];
}
