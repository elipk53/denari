import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import axios from "axios";
import { getAccessToken } from "@/lib/graphClient";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const emailId = params.id;
    const db = await connectDb();

    const client = await db
      .collection("clients")
      .findOne({ "emails.id": emailId });

    if (!client) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    try {
      const token = await getAccessToken();
      const receiver = client.emails.find(
        (email: any) => email.id === emailId
      )?.receiver;
      await axios.delete(
        `https://graph.microsoft.com/v1.0/users/${receiver}/messages/${emailId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (graphError) {
      console.error("Error deleting from Microsoft Graph:", graphError);
    }

    await db
      .collection("clients")
      .updateOne(
        { _id: client._id },
        { $pull: { emails: { id: emailId } } as any }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
