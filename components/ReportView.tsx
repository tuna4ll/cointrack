import { AddressPrivacyReport, TransactionPrivacyReport } from '@/lib/types';
import PrivacyScore from './PrivacyScore';
import RiskCard from './RiskCard';
import TransactionGraph from './TransactionGraph';

interface ReportViewProps {
  report: AddressPrivacyReport | TransactionPrivacyReport | null;
  type: 'address' | 'tx' | null;
}

export default function ReportView({ report, type }: ReportViewProps) {
  if (!report || !type) return null;

  const isAddressReport = (rep: AddressPrivacyReport | TransactionPrivacyReport): rep is AddressPrivacyReport => {
    return 'address' in rep;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-[#a3a3a3] text-xs font-mono uppercase tracking-widest">
            Privacy Analysis Report
          </h2>
          <p className="text-[#f5f5f5] font-mono break-all text-sm md:text-base">
            {isAddressReport(report) ? report.address : report.txid}
          </p>
        </div>
        <div className="text-[#a3a3a3] text-xs font-mono uppercase">
          Target: {type.toUpperCase()}
        </div>
      </div>

      <PrivacyScore 
        grade={report.privacyGrade} 
        reasons={report.warnings} 
      />

      {isAddressReport(report) && report.clusterAddresses && report.clusterAddresses.length > 0 && (
        <div className="bg-[#111111] p-6 rounded-xl border border-amber-500/20 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-amber-500 font-bold font-mono uppercase text-sm tracking-wider">
              Linked Wallet Cluster (Entity Analysis)
            </h4>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20 font-mono">
              Common Input Ownership
            </span>
          </div>
          <p className="text-[#a3a3a3] text-xs font-mono leading-relaxed">
            The following addresses were spent together with this address in the same transaction. 
            This strongly suggests they belong to the same entity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.clusterAddresses.map((addr, i) => (
              <div key={i} className="bg-[#050505] p-2 rounded border border-[#262626] text-[10px] font-mono text-[#f5f5f5] truncate">
                {addr}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAddressReport(report) && (
        <TransactionGraph report={report} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isAddressReport(report) ? (
          <>
            <RiskCard
              title="Address Reuse"
              value={`${report.reuseCount} times`}
              risk={report.addressReuseRisk}
              description="Frequency of use. Reuse links multiple payments."
            />
            <RiskCard
              title="UTXO Consolidation"
              value={`${report.utxoCount} inputs`}
              risk={report.consolidationRisk}
              description="Combining separate coins links them to one owner."
            />
          </>
        ) : (
          <>
            <RiskCard
              title="Consolidation Risk"
              value={`${report.inputCount} inputs`}
              risk={report.consolidationRisk}
              description="Spending many inputs together suggests a common wallet owner."
            />
            <RiskCard
              title="Change Output"
              value={report.possibleChangeOutput ? 'Detected' : 'Not Clear'}
              risk={report.changeConfidence}
              description="Heuristics suggesting returned change output."
            />
          </>
        )}
      </div>

      {isAddressReport(report) && report.recommendations.length > 0 && (
        <div className="bg-[#111111] p-8 rounded-xl border border-[#262626] space-y-4">
          <h4 className="text-[#7dd3fc] font-bold font-mono uppercase text-sm tracking-wider">
            Recommendations:
          </h4>
          <ul className="space-y-3">
            {report.recommendations.map((rec, index) => (
              <li key={index} className="text-[#f5f5f5] text-sm flex gap-3">
                <span className="text-[#7dd3fc]">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
