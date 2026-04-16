import type { CreateLeadInput } from '@reaa/shared';

export async function createLead(input: CreateLeadInput) {
  return {
    leadId: crypto.randomUUID(),
    created: true,
    payload: input,
    createdAt: new Date().toISOString(),
  };
}
