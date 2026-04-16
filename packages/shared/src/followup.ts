export interface FollowUpConfig {
  firstFollowUpHours: number;
  secondFollowUpHours: number;
  markDiscardedAfterSecondNoReply: boolean;
}

export const DEFAULT_FOLLOW_UP_CONFIG: FollowUpConfig = {
  firstFollowUpHours: 6,
  secondFollowUpHours: 9,
  markDiscardedAfterSecondNoReply: true,
};

export type FollowUpStatus =
  | 'none'
  | 'waiting_first_followup'
  | 'waiting_second_followup'
  | 'discarded_no_response'
  | 'responded';
