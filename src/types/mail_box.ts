export type Email = {
  id: string;
  subject: string;
  sentDate: string;
  from: string;
  to: string;
  cc: string;
  body: string;
  url?: string;
  references?: string;
};
