import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import TurndownService from "turndown";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 15) return 'text-green-400';
  if (score >= 12) return 'text-blue-400';
  if (score >= 8) return 'text-yellow-400';
  return 'text-red-400';
}

export function convertHtmlToMarkdown(html: string): string {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

export function calculateResponseTimeScore(responseTimeInHours: number): number {
  if (responseTimeInHours > 24 * 4) return 1; 
  if (responseTimeInHours > 24 * 1) return 2; 
  if (responseTimeInHours > 16) return 3; 
  if (responseTimeInHours > 4) return 4; 
  return 5; 
}
