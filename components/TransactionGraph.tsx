import { TransactionPrivacyReport } from '@/lib/types';

interface TransactionGraphProps {
  report: TransactionPrivacyReport;
}

export default function TransactionGraph({ report }: TransactionGraphProps) {
  const formatSats = (sats: number) => (sats / 100000000).toFixed(4);

  return (
    <div className="bg-[#111111] p-8 rounded-xl border border-[#262626] overflow-x-auto">
      <h3 className="text-[#7dd3fc] font-bold font-mono uppercase text-sm mb-8 tracking-widest text-center">
        Transaction Flow
      </h3>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 min-w-[600px]">
        {/* Inputs Column */}
        <div className="flex flex-col gap-3 w-1/3">
          <span className="text-[#a3a3a3] text-[10px] font-mono uppercase text-center mb-2">Inputs</span>
          {report.inputs.slice(0, 5).map((input, i) => (
            <div key={i} className="bg-[#050505] p-3 rounded border border-[#262626] text-[10px] font-mono relative group">
              <div className="truncate text-[#f5f5f5]" title={input.address}>{input.address}</div>
              <div className="text-[#7dd3fc] mt-1">{formatSats(input.value)} BTC</div>
              <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-[#262626]"></div>
            </div>
          ))}
          {report.inputs.length > 5 && (
            <div className="text-[#a3a3a3] text-[10px] font-mono text-center">
              + {report.inputs.length - 5} more inputs
            </div>
          )}
        </div>

        {/* Transaction Core */}
        <div className="flex flex-col items-center justify-center relative px-8 py-12 bg-[#050505] border border-[#7dd3fc]/30 rounded-full aspect-square w-32 shrink-0">
          <div className="absolute inset-0 border border-[#7dd3fc]/10 animate-pulse rounded-full"></div>
          <span className="text-[#7dd3fc] font-bold font-mono text-sm z-10">TX</span>
        </div>

        {/* Outputs Column */}
        <div className="flex flex-col gap-3 w-1/3">
          <span className="text-[#a3a3a3] text-[10px] font-mono uppercase text-center mb-2">Outputs</span>
          {report.outputs.map((output, i) => {
            const isChange = output.address === report.possibleChangeOutput;
            return (
              <div 
                key={i} 
                className={`p-3 rounded border text-[10px] font-mono relative group transition-colors ${
                  isChange ? 'bg-[#7dd3fc]/5 border-[#7dd3fc]/50' : 'bg-[#050505] border-[#262626]'
                }`}
              >
                <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-[#262626]"></div>
                <div className="truncate text-[#f5f5f5]" title={output.address}>{output.address}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#7dd3fc]">{formatSats(output.value)} BTC</span>
                  {isChange && (
                    <span className="text-[8px] bg-[#7dd3fc] text-[#050505] px-1 rounded font-bold uppercase">
                      Change?
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
