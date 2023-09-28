export type Email = {
  id: number;
  subject: string;
  sentDate: string;
  from: string;
  to: string;
  cc: string;
  body: string;
  url?: string;
};
