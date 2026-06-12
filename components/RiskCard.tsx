import { RiskLevel } from '@/lib/types';

interface RiskCardProps {
  title: string;
  value: string | number;
  risk: RiskLevel;
  description: string;
}

export default function RiskCard({ title, value, risk, description }: RiskCardProps) {
  const riskColors = {
    low: 'text-green-500',
    medium: 'text-amber-500',
    high: 'text-red-500',
  };

  const borderColors = {
    low: 'border-green-500/20',
    medium: 'border-amber-500/20',
    high: 'border-red-500/20',
  };

  return (
    <div className={`bg-[#111111] p-6 rounded-lg border ${borderColors[risk]} space-y-3`}>
      <div className="flex justify-between items-start">
        <h3 className="text-[#a3a3a3] text-sm font-mono uppercase tracking-wider">{title}</h3>
        <span className={`text-xs font-bold font-mono px-2 py-1 rounded bg-[#050505] ${riskColors[risk]} border border-[#262626]`}>
          {risk.toUpperCase()}
        </span>
      </div>
      <div className="text-2xl font-bold text-[#f5f5f5] font-mono">
        {value}
      </div>
      <p className="text-[#a3a3a3] text-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}
