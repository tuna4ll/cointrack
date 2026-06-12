import { RiskLevel, PrivacyGrade } from '../types';

export function calculatePrivacyScore(deductions: number): { grade: PrivacyGrade; score: number } {
  const score = Math.max(0, 100 - deductions);
  
  let grade: PrivacyGrade = 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 35) grade = 'D';
  
  return { grade, score };
}

export function getAddressReuseRisk(txCount: number): RiskLevel {
  if (txCount <= 1) return 'low';
  if (txCount <= 5) return 'medium';
  return 'high';
}

export function getConsolidationRisk(inputCount: number): RiskLevel {
  if (inputCount <= 1) return 'low';
  if (inputCount <= 4) return 'medium';
  return 'high';
}
