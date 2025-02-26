import { getScoreColor } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
  emailCount: number;
}

export default function ScoreCard({ score, emailCount }: ScoreCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Email Score Overview</h2>
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={`${getScoreColor(score)}`}
              strokeWidth="10"
              strokeDasharray={`${(score / 20) * 251.2} 251.2`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-300">
          Average score based on {emailCount} {emailCount === 1 ? 'email' : 'emails'}
        </p>
      </div>
    </div>
  );
}