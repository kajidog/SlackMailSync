export type Filter = {
  slack_id: string;
  user_name: string;
  filter_name: string;
  priority: number;
  subject?: string;
  from?: string;
  to?: string;
  cc?: string;
  action_type: string;
  forward_channel?: string;
};
