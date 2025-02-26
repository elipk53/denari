export interface Email {
  id: string;
  subject: string;
  body: string;
  score: number;
  date: string;
}

export interface Client {
  id: string;
  email: string;
  company: string;
  emails: Email[];
}