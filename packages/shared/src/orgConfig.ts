import type { FollowUpConfig } from './followup.js';

export interface OrgBotConfig {
  orgId: string;
  assistantName: string;
  agencyName: string;
  followUp: FollowUpConfig;
  askPhoneBeforeLead: boolean;
}

export const DEFAULT_ORG_BOT_CONFIG: OrgBotConfig = {
  orgId: 'default',
  assistantName: 'Sunny',
  agencyName: 'la inmobiliaria',
  followUp: {
    firstFollowUpHours: 6,
    secondFollowUpHours: 9,
    markDiscardedAfterSecondNoReply: true,
  },
  askPhoneBeforeLead: true,
};
