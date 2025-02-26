import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 18) return 'text-green-400';
  if (score >= 15) return 'text-blue-400';
  if (score >= 10) return 'text-yellow-400';
  return 'text-red-400';
}