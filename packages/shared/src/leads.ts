import type { ChannelType } from './channels.js';
import type { IntentType } from './intents.js';

export type LeadTemperature = 'cold' | 'warm' | 'hot';

export interface CreateLeadInput {
  orgId: string;
  propertyId?: number | null;
  sessionId?: string | null;
  customerId?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  message?: string | null;
  source?: string | null;
  channel?: ChannelType | null;
  leadType?: IntentType | null;
  conversationSummary?: string | null;
  leadScore?: number | null;
  leadTemperature?: LeadTemperature | null;
  humanHandoffRequested?: boolean;
  operationType?: string | null;
  propertyType?: string | null;
  zone?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string | null;
  bedrooms?: number | null;
  urgency?: string | null;
}
