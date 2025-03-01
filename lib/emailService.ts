import axios from "axios";
import { getAccessToken } from "./graphClient";
import { convertHtmlToMarkdown } from "./utils";
import { saveClientsToDb } from "./data";
import { Email } from "./types";

const GRAPH_API_BASE_URL = "https://graph.microsoft.com/v1.0";
const ORGANIZATION_DOMAINS = process.env.ORGANIZATION_DOMAINS?.split(",") || [
  "spellcpa.com",
];

async function getAllUsers(): Promise<string[]> {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${GRAPH_API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.value.map((user: any) => user.id);
  } catch (error: any) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function getEmailsForUser(userId: string, token: string) {
  let emails: any[] = [];
  let nextPageUrl = `${GRAPH_API_BASE_URL}/users/${userId}/messages?$top=50`;

  try {
    while (nextPageUrl) {
      const response = await axios.get(nextPageUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      emails = emails.concat(response.data.value);
      nextPageUrl = response.data["@odata.nextLink"] || null;
    }

    return emails.map((email: any) => ({
      id: email.id,
      sender: email.from?.emailAddress?.address || "Unknown Sender",
      subject: email.subject || "No Subject",
      body: convertHtmlToMarkdown(email.body?.content) || "No Content",
      receivedAt: new Date(email.receivedDateTime),
      conversationId: email.conversationId || "Unknown Conversation",
    }));
  } catch (error: any) {
    console.error(
      `Error fetching emails for user ${userId}:`,
      error.response?.data || error.message
    );
    return [];
  }
}

export async function fetchEmailsAndSave() {
  const token = await getAccessToken();
  const userIds = await getAllUsers();
  let allEmails: any[] = [];

  for (const userId of userIds) {
    const userEmails = await getEmailsForUser(userId, token);
    allEmails = allEmails.concat(userEmails);
  }

  const inboundEmails = allEmails.filter(isInboundEmail);
  const clients = groupEmailsBySender(inboundEmails);
  await saveClientsToDb(clients);
  return clients;
}

function isInboundEmail(email: any): boolean {
  const senderEmail = email.sender || "";
  const isMicrosoftEmail = senderEmail.endsWith("@microsoft.com");
  const isOutboundEmail = ORGANIZATION_DOMAINS.some((domain) =>
    senderEmail.endsWith(`@${domain}`)
  );
  return !isOutboundEmail && !isMicrosoftEmail;
}

function groupEmailsBySender(emails: any[]) {
  const groupedEmails: Record<string, any> = {};

  emails.forEach((email) => {
    const senderEmail = email.sender || "Unknown Sender";
    const emailDomain = senderEmail.split("@")[1] || "Unknown Domain";

    if (!groupedEmails[senderEmail]) {
      groupedEmails[senderEmail] = {
        sender: senderEmail,
        client: emailDomain,
        emails: [],
      };
    }

    groupedEmails[senderEmail].emails.push({
      id: email.id,
      subject: email.subject,
      body: email.body,
      receivedAt: email.receivedAt,
    });
  });

  Object.values(groupedEmails).forEach((group) => {
    group.emails.sort(
      (a: any, b: any) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  });

  return Object.values(groupedEmails);
}

export function calculateResponseTime(emails: Email[]) {
  if (!emails || emails.length === 0) {
    return {};
  }

  const responseTimes: Record<string, number> = {};

  const conversations: Record<string, Email[]> = {};
  emails.forEach((email) => {
    if (!email.conversationId) return;

    if (!conversations[email.conversationId]) {
      conversations[email.conversationId] = [];
    }
    conversations[email.conversationId].push(email);
  });

  Object.values(conversations).forEach((conversationEmails) => {
    conversationEmails.sort(
      (a, b) =>
        new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
    );

    let lastSentEmail: Email | null = null;

    conversationEmails.forEach((email) => {
      if (!email.sender) return;

      const isSentByCompany = ORGANIZATION_DOMAINS.some((domain) =>
        email.sender.endsWith(`@${domain}`)
      );

      if (!isSentByCompany && lastSentEmail) {
        const responseTime =
          (new Date(email.receivedAt).getTime() -
            new Date(lastSentEmail.receivedAt).getTime()) /
          (1000 * 60 * 60);
        responseTimes[email.id] = responseTime;
      }

      if (isSentByCompany) {
        lastSentEmail = email;
      }
    });
  });

  return responseTimes;
}
