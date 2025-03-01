import axios from "axios";

const TOKEN_URL = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`;

export async function getAccessToken() {
    try {
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            client_id: process.env.MICROSOFT_CLIENT_ID!,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
            scope: "https://graph.microsoft.com/.default",
            grant_type: "client_credentials",
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Error getting access token:", error);
        throw new Error("Failed to authenticate with Microsoft Graph API.");
    }
}
