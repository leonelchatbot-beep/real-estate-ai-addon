import type { PropertySearchInput } from '@reaa/shared';
import { searchPropertiesFromApi } from './apiRepository.js';

export async function searchProperties(input: PropertySearchInput) {
  return searchPropertiesFromApi(input);
}
