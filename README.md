
## Registering an App for Microsoft Graph API

To use Microsoft Graph API, you need to register an application in the Azure portal and configure the necessary permissions. Follow these steps:

1. **Go to the Azure Portal**: Navigate to [Azure Portal](https://portal.azure.com/).

2. **Register a New Application**:
   - In the left sidebar, select **Azure Active Directory**.
   - Click on **App registrations**.
   - Click on **New registration**.
   - Enter a name for your application.
   - Choose the appropriate account type (e.g., "Accounts in this organizational directory only").
   - Click **Register**.

3. **Configure API Permissions**:
   - After registering, go to the **API permissions** section.
   - Click on **Add a permission**.
   - Select **Microsoft Graph**.
   - Choose **Application permissions**.
   - Search for and select the following permissions:
     - `User.Read.All`
     - `Mail.Read`
     - `Mail.ReadWrite`
   - Click **Add permissions**.
   - Grant admin consent for the application.

4. **Create a Client Secret**:
   - Go to the **Certificates & secrets** section.
   - Click on **New client secret**.
   - Provide a description and set an expiration period.
   - Click **Add** and copy the value of the client secret. You will need this for your environment variables.

5. **Copy Tenant ID, Client ID, and Client Secret**:
   - In the **Overview** section, copy the **Directory (tenant) ID** and **Application (client) ID**.
   - Store these values in the environment variables as follows:

```plaintext
MICROSOFT_TENANT_ID=<Tenant_ID>
MICROSOFT_CLIENT_ID=<Client_ID>
MICROSOFT_CLIENT_SECRET=<Client_Secret>
```

Make sure to replace `<Tenant_ID>`, `<Client_ID>`, and `<Client_Secret>` with the actual values copied from the Azure portal.



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
