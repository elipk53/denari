export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchEmailsAndSave } from "@/lib/emailService";

export async function GET() {
  try {
    console.log("Running scheduled email fetch...");
    await fetchEmailsAndSave();
    return NextResponse.json({ message: "Emails processed successfully" });
  } catch (error) {
    console.error("Error processing emails:", error);
    return NextResponse.json(
      { error: "Failed to process emails" },
      { status: 500 }
    );
  }
}
