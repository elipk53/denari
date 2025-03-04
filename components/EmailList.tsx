"use client";
import ReactMarkdown from "react-markdown";
import { Email } from "@/lib/types";
import { format } from "date-fns";
import { getScoreColor } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EmailListProps {
  emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
  const [deletingEmailId, setDeletingEmailId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (emailId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this email?")) {
      setDeletingEmailId(emailId);

      try {
        const response = await fetch(`/api/emails/${emailId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.refresh();
        } else {
          alert("Failed to delete email");
        }
      } catch (error) {
        console.error("Error deleting email:", error);
        alert("An error occurred while deleting the email");
      } finally {
        setDeletingEmailId(null);
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Email History</h2>
      <div className="space-y-4">
        {emails.map((email) => (
          <div key={email.id} className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{email.subject}</h3>
              <div className="flex items-center">
                <span className="mr-2">Score:</span>
                <span
                  className={`font-bold ${getScoreColor(
                    email.scores?.totalScore || 0
                  )}`}
                >
                  {email.scores?.totalScore || 0}
                </span>
                <button
                  onClick={(e) => handleDelete(email.id, e)}
                  disabled={deletingEmailId === email.id}
                  className="ml-4 text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  title="Delete email"
                >
                  {deletingEmailId === email.id ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
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
