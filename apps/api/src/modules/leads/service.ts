import type { CreateLeadInput } from '@reaa/shared';
import { createLeadViaApi } from './apiRepository.js';

export async function createLead(input: CreateLeadInput) {
  return createLeadViaApi(input);
}
