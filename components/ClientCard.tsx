import Link from 'next/link';
import { Client } from '@/lib/types';
import { getAverageScore } from '@/lib/data';
import { getScoreColor } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
}

export default async function ClientCard({ client }: ClientCardProps) {
  const averageScores = getAverageScore(client); 

  return (
    <Link href={`/clients/${client.id}`}>
      <div className="border border-gray-700 rounded-lg p-6 hover:bg-gray-900 transition-colors cursor-pointer">
        <p className="text-gray-300 mb-4">{client.company}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{client.emails.length} emails</span>
          <div className="flex items-center">
            <span className="mr-2">Avg. Score:</span>
            <span className={`font-bold ${getScoreColor(averageScores.totalScore)}`}>
              {averageScores.totalScore}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}