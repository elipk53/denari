import { getClients } from '@/lib/data';
import ClientCard from '@/components/ClientCard';
import FetchEmailsButton from '@/components/FetchEmailsButton';

export const dynamic = "force-dynamic";

export default async function Home() {
  const clients = await getClients();

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-col justify-between">
            <h1 className="text-3xl font-bold">Client Communications</h1>
            <div className="flex items-center justify-between ">
              <p className="text-gray-400">View client email scores</p>
              <FetchEmailsButton />
            </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}