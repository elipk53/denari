"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FetchEmailsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/processEmails");
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={fetchEmails}
      disabled={isLoading}
      className="bg-[#5033df] hover:bg-[#4129b8] text-white px-3 py-2 rounded-lg flex items-center transition-colors disabled:bg-[#5033df] disabled:cursor-not-allowed text-sm"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
          Processing...
        </>
      ) : (
        "Load New Emails"
      )}
    </button>
  );
}
