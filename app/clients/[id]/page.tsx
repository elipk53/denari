export const dynamic = "force-dynamic";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClientById, getAverageScore, getClients } from '@/lib/data';
import ScoreCard from '@/components/ScoreCard';
import EmailList from '@/components/EmailList';
import ScoreRadarChart from '@/components/ScoreRadarChart';

interface ClientPageProps {
  params: {
    id: string;
  };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const client = await getClientById(params.id);
  
  if (!client) {
    notFound();
  }
  
  const averageScores = getAverageScore(client);

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-400 hover:underline flex items-center">
          ← Back to client list
        </Link>
      </div>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{client.company}</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ScoreCard score={averageScores.totalScore} emailCount={client.emails.length} />
          <div className="mt-6">
            <ScoreRadarChart scores={averageScores} />
          </div>
        </div>
        <div className="md:col-span-2">
          <EmailList emails={client.emails} />
        </div>
      </div>
    </div>
  );
}
