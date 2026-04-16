export interface PropertySearchInput {
  orgId: string;
  operationType?: string;
  propType?: string;
  zone?: string;
  budgetMin?: number;
  budgetMax?: number;
  currencyId?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  garage?: boolean;
  mortgageEligible?: boolean;
  limit?: number;
}

export interface PropertyResult {
  propertyId: number;
  orgId: string;
  orgName?: string | null;
  propType?: string | null;
  operationType?: string | null;
  district?: string | null;
  neighborhood?: string | null;
  region?: string | null;
  currencyId?: string | null;
  price?: number | null;
  coveredSquareMeters?: number | null;
  rooms?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  garage?: boolean | null;
  mortgageEligible?: boolean | null;
  sourceScope: 'office' | 'global';
}
