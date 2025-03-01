export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
  conversationId: string;
  scores: {
    responseTime: number;
    fairness: number;
    respect: number;
    professionalism: number;
    totalScore: number;
  };
}

export interface Client {
  id: string;
  sender: string;
  company: string;
  emails: Email[];
}