import { Client } from './types';

export const clients: Client[] = [
  {
    id: '1',
    email: 'john.smith@acme.com',
    company: 'acme.com',
    emails: [
      {
        id: '101',
        subject: 'Project Update',
        body: 'Here is the latest update on our project...',
        score: 20,
        date: '2025-04-10T14:30:00Z',
      },
      {
        id: '102',
        subject: 'Meeting Request',
        body: 'Can we schedule a meeting to discuss...',
        score: 18,
        date: '2025-04-12T09:15:00Z',
      },
      {
        id: '103',
        subject: 'Contract Renewal',
        body: 'We need to discuss the terms of our contract renewal...',
        score: 17,
        date: '2025-04-15T16:45:00Z',
      },
    ],
  },
  {
    id: '2',
    email: 'sawyer@denari.ai',
    company: 'denari.ai',
    emails: [
      {
        id: '201',
        subject: 'API Integration',
        body: 'We need to discuss the API integration timeline...',
        score: 14,
        date: '2025-04-08T11:20:00Z',
      },
      {
        id: '202',
        subject: 'Bug Report',
        body: 'We found a critical bug in the latest release...',
        score: 19,
        date: '2025-04-11T13:40:00Z',
      },
    ],
  },
  {
    id: '3',
    email: 'michael.chen@lucida.com',
    company: 'lucida.com',
    emails: [
      {
        id: '301',
        subject: 'Partnership Opportunity',
        body: 'I would like to discuss a potential partnership...',
        score: 12,
        date: '2025-04-09T10:00:00Z',
      },
      {
        id: '302',
        subject: 'Product Feedback',
        body: 'Here is our feedback on your latest product...',
        score: 15,
        date: '2025-04-13T15:30:00Z',
      },
      {
        id: '303',
        subject: 'Quarterly Review',
        body: 'Let\'s schedule our quarterly review meeting...',
        score: 20,
        date: '2025-04-16T09:45:00Z',
      },
      {
        id: '304',
        subject: 'Budget Approval',
        body: 'We need your approval on the revised budget...',
        score: 15,
        date: '2025-04-18T14:15:00Z',
      },
    ],
  },
];

export function getClients() {
  return clients;
}

export function getClientById(id: string) {
  return clients.find(client => client.id === id);
}

export function getAverageScore(clientId: string) {
  const client = getClientById(clientId);
  if (!client || client.emails.length === 0) return 0;
  
  const totalScore = client.emails.reduce((sum, email) => sum + email.score, 0);
  return Math.round((totalScore / client.emails.length) * 10) / 10; 
}