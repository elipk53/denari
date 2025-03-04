"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ScoreRadarChartProps {
  scores: {
    fairness: number;
    respect: number;
    professionalism: number;
  };
}

export default function ScoreRadarChart({ scores }: ScoreRadarChartProps) {
  const data = [
    
    { metric: "Professionalism", score: scores.professionalism },
    { metric: "Fairness", score: scores.fairness },
    { metric: "Respect", score: scores.respect },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis domain={[0, 5]} tickCount={6} />
        <Radar
          name="Scores"
          dataKey="score"
          stroke="#5033df"
          fill="#5033df"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
