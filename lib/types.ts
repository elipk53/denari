export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
  conversationId: string;
  scores: {
    responseTime: { score: number; explanation: string };
    fairness: { score: number; explanation: string };
    respect: { score: number; explanation: string };
    professionalism: { score: number; explanation: string };
    totalScore: number;
  };
}

export interface Client {
  id: string;
  sender: string;
  company: string;
  emails: Email[];
}