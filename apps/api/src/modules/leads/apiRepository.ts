import type { CreateLeadInput } from '@reaa/shared';
import { env } from '../../lib/env.js';
import { postJson } from '../../lib/http.js';

interface LeadApiResponse {
  data: {
    lead_id: string;
    org_id: string;
    property_id: number;
    created_at: string;
  };
}

export async function createLeadViaApi(input: CreateLeadInput) {
  if (!input.propertyId) {
    throw new Error('propertyId is required to create a lead through the properties API');
  }

  if (!input.sessionId) {
    throw new Error('sessionId is required to create a lead through the properties API');
  }

  const url = new URL(`/properties/${input.propertyId}/leads`, env.apiBaseUrl);
  const response = await postJson<LeadApiResponse>(url.toString(), {
    session_id: input.sessionId,
    customer_id: input.customerId,
    user_id: null,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone,
    message: input.message,
    status: 'new',
    source: input.source,
  });

  return {
    leadId: response.data.lead_id,
    created: true,
    payload: input,
    createdAt: response.data.created_at,
  };
}
