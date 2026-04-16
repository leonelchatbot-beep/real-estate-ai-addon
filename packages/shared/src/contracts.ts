import type { ChannelType } from './channels.js';
import type { CreateLeadInput } from './leads.js';
import type { PropertySearchInput, PropertyResult } from './properties.js';
import type { IntentType, RequiredQuestionKey } from './intents.js';
import type { LeadTag } from './tags.js';

export interface WebchatSessionRequest {
  orgId: string;
  sourceUrl?: string;
  referrerUrl?: string;
  landingUrl?: string;
  userAgent?: string;
}

export interface WebchatMessageRequest {
  orgId: string;
  sessionId?: string;
  message: string;
  channel?: ChannelType;
}

export interface WebchatMessageResponse {
  ok: true;
  intent: IntentType;
  nextQuestion: RequiredQuestionKey | null;
  missingQuestions: RequiredQuestionKey[];
  tags: LeadTag[];
  replyPreview: string;
}

export interface PropertySearchRequest extends PropertySearchInput {}

export interface PropertySearchResponse {
  ok: true;
  count: number;
  results: PropertyResult[];
}

export interface LeadCreateRequest extends CreateLeadInput {}
