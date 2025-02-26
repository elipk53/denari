import Link from 'next/link';
import { Client } from '@/lib/types';
import { getAverageScore } from '@/lib/data';
import { getScoreColor } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  const averageScore = getAverageScore(client.id);
  
  return (
    <Link href={`/clients/${client.id}`}>
      <div className="border border-gray-700 rounded-lg p-6 hover:bg-gray-900 transition-colors cursor-pointer">
        <h2 className="text-xl font-bold mb-2">{client.company}</h2>
        <p className="text-gray-300 mb-4">{client.email}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{client.emails.length} emails</span>
          <div className="flex items-center">
            <span className="mr-2">Avg. Score:</span>
            <span className={`font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
