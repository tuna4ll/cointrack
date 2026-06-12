import Link from 'next/link';

export default function Docs() {
  const topics = [
    { title: 'Address Reuse', desc: 'Using the same address multiple times makes it easy to link all those transactions to a single owner.' },
    { title: 'UTXO Consolidation', desc: 'Combining multiple inputs into one transaction suggests they all belong to the same wallet.' },
    { title: 'Change Output Leak', desc: 'When change is sent to a new address but with certain patterns, observers can guess which output is the change.' },
    { title: 'Wallet Clustering', desc: 'The process of grouping multiple addresses together based on spending patterns.' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] p-8 md:p-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold font-mono text-[#7dd3fc]">Documentation</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, i) => (
            <div key={i} className="bg-[#111111] p-6 rounded-lg border border-[#262626] space-y-3">
              <h3 className="text-[#f5f5f5] font-bold font-mono">{topic.title}</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>
        <div className="pt-8 text-center">
          <Link href="/" className="text-[#7dd3fc] hover:underline font-mono">← Back to Analyzer</Link>
        </div>
      </div>
    </main>
  );
}
