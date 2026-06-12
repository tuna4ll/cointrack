'use client';

import { useState } from 'react';
import AnalyzerForm from '@/components/AnalyzerForm';
import ReportView from '@/components/ReportView';
import { AddressPrivacyReport, TransactionPrivacyReport } from '@/lib/types';

export default function Home() {
  const [report, setReport] = useState<AddressPrivacyReport | TransactionPrivacyReport | null>(null);
  const [reportType, setReportType] = useState<'address' | 'tx' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (value: string, type: 'address' | 'tx') => {
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      if (type === 'address') {
        const response = await fetch(`/api/address?address=${value}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to analyze address');
        setReport(data);
      } else {
        const response = await fetch(`/api/tx?txid=${value}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to analyze transaction');
        setReport(data);
      }
      setReportType(type);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen selection:bg-[#7dd3fc]/30">
      <div className="container mx-auto px-4 py-16 space-y-16">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black font-mono tracking-tighter text-[#7dd3fc]">
            COINTRACK
          </h1>
          <p className="text-[#a3a3a3] text-lg md:text-xl font-mono leading-relaxed">
            Bitcoin privacy analyzer. Detect patterns, reuse, and fingerprints.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <span className="px-3 py-1 bg-[#262626] text-[#a3a3a3] rounded text-xs font-mono">
              Privacy Focused
            </span>
            <span className="px-3 py-1 bg-[#262626] text-[#a3a3a3] rounded text-xs font-mono">
              Educational
            </span>
          </div>
        </section>

        <section>
          <AnalyzerForm onAnalyze={handleAnalyze} />
        </section>

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#7dd3fc] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#a3a3a3] font-mono animate-pulse">Scanning patterns...</p>
          </div>
        )}

        {report && !isAnalyzing && (
          <section className="pt-8">
            <ReportView report={report} type={reportType} />
          </section>
        )}

        {!report && !isAnalyzing && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-12">
            <div className="bg-[#111111] p-6 rounded-lg border border-[#262626]">
              <h3 className="text-[#7dd3fc] font-bold mb-2 font-mono uppercase text-sm">No Tracking</h3>
              <p className="text-[#a3a3a3] text-sm">No storage, no IP logs, no identifiers.</p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#262626]">
              <h3 className="text-[#7dd3fc] font-bold mb-2 font-mono uppercase text-sm">Heuristics</h3>
              <p className="text-[#a3a3a3] text-sm">Detecting address reuse and change leaks.</p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#262626]">
              <h3 className="text-[#7dd3fc] font-bold mb-2 font-mono uppercase text-sm">Open Data</h3>
              <p className="text-[#a3a3a3] text-sm">Learn how the UTXO model works in practice.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
