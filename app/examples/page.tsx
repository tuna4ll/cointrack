'use client';

import Link from 'next/link';

export default function Examples() {
  const examples = [
    { type: 'Address', value: 'bc1qexampleaddress1234567890', label: 'Heavily Reused Address' },
    { type: 'Transaction', value: 'txid9876543210abcdef9876543210', label: 'Consolidation Transaction' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] p-8 md:p-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold font-mono text-[#7dd3fc]">Demo Examples</h1>
        <p className="text-[#a3a3a3] font-mono">Click to copy example data for testing:</p>
        <div className="space-y-4">
          {examples.map((ex, i) => (
            <div key={i} className="bg-[#111111] p-6 rounded-lg border border-[#262626] flex justify-between items-center">
              <div>
                <p className="text-[#f5f5f5] font-bold font-mono">{ex.label}</p>
                <p className="text-[#a3a3a3] text-xs font-mono">{ex.value}</p>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(ex.value)}
                className="text-[#7dd3fc] text-xs font-mono border border-[#7dd3fc] px-3 py-1 rounded hover:bg-[#7dd3fc]/10 cursor-pointer"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        <div className="pt-8">
          <Link href="/" className="text-[#7dd3fc] hover:underline font-mono">← Back to Analyzer</Link>
        </div>
      </div>
    </main>
  );
}
