import { PrivacyGrade } from '@/lib/types';

interface PrivacyScoreProps {
  grade: PrivacyGrade;
  reasons: string[];
}

export default function PrivacyScore({ grade, reasons }: PrivacyScoreProps) {
  const gradeColors = {
    A: 'text-green-500',
    B: 'text-green-400',
    C: 'text-amber-500',
    D: 'text-orange-500',
    F: 'text-red-500',
  };

  return (
    <div className="bg-[#111111] p-8 rounded-xl border border-[#262626] flex flex-col md:flex-row items-center gap-8">
      <div className="flex flex-col items-center">
        <span className="text-[#a3a3a3] text-xs font-mono uppercase mb-2">Privacy Grade</span>
        <div className={`text-8xl font-black font-mono ${gradeColors[grade]}`}>
          {grade}
        </div>
      </div>
      <div className="flex-1 space-y-4 w-full text-left">
        <h4 className="text-[#f5f5f5] font-bold font-mono">Deductions:</h4>
        <ul className="space-y-2">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-[#a3a3a3]">
              <span className="text-red-500 mt-1">−</span>
              {reason}
            </li>
          ))}
          {reasons.length === 0 && (
            <li className="text-green-500 text-sm font-mono italic">
              No privacy leaks detected.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
