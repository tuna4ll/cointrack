import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] p-8 md:p-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold font-mono text-[#7dd3fc]">About Cointrack</h1>
        <div className="space-y-6 text-[#a3a3a3] font-mono leading-relaxed">
          <p>
            Cointrack is a Bitcoin privacy analyzer that helps users understand how they may accidentally expose themselves on-chain.
          </p>
          <p>
            The project does <strong className="text-[#f5f5f5]">not</strong> deanonymize people, attack wallets, or trace real-world identities.
            It focuses on educational privacy analysis by detecting common Bitcoin wallet mistakes such as address reuse, UTXO consolidation, change-output leaks, and weak transaction patterns.
          </p>
          <p>
            The goal is to teach users how Bitcoin privacy breaks in practice.
          </p>
        </div>
        <div className="pt-8">
          <Link href="/" className="text-[#7dd3fc] hover:underline font-mono">← Back to Analyzer</Link>
        </div>
      </div>
    </main>
  );
}
