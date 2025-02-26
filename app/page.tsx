import { getClients } from '@/lib/data';
import ClientCard from '@/components/ClientCard';

export default function Home() {
  const clients = getClients();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Client Communications</h1>
        <p className="text-gray-400 mt-2">View client email scores</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}