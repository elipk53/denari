'use client';
import ReactMarkdown from "react-markdown";
import { Email } from "@/lib/types";
import { format } from "date-fns";
import { getScoreColor } from "@/lib/utils";

interface EmailListProps {
  emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Email History</h2>
      <div className="space-y-4" >
        {emails.map((email) => (
          <div key={email.id} className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{email.subject}</h3>
              <div className="flex items-center">
                <span className="mr-2">Score:</span>
                <span className={`font-bold ${getScoreColor(email.scores?.totalScore || 0)}`}>
                  {email.scores?.totalScore || 0}
                </span>
              </div>
            </div>
            <div className="text-gray-300 mb-3">
              <ReactMarkdown>{email.body}</ReactMarkdown>
            </div>
            <p className="text-sm text-gray-400">
              {format(new Date(email.receivedAt), "PPP p")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
