'use client';

import { useState } from 'react';

interface AnalyzerFormProps {
  onAnalyze: (value: string, type: 'address' | 'tx') => void;
}

export default function AnalyzerForm({ onAnalyze }: AnalyzerFormProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent, type: 'address' | 'tx') => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim(), type);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-[#111111] p-8 rounded-xl border border-[#262626] shadow-2xl">
        <h2 className="text-2xl font-bold text-[#f5f5f5] mb-6 font-mono tracking-tight">
          Analyze Bitcoin Privacy
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Bitcoin Address or Transaction ID"
            className="w-full bg-[#050505] border border-[#262626] rounded-lg p-4 text-[#f5f5f5] outline-none focus:border-[#7dd3fc] transition-colors placeholder:text-[#a3a3a3] font-mono"
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={(e) => handleSubmit(e, 'address')}
              className="bg-[#7dd3fc] text-[#050505] font-bold py-3 rounded-lg hover:bg-[#a5f3fc] transition-colors font-mono cursor-pointer"
            >
              Analyze Address
            </button>
            <button
              onClick={(e) => handleSubmit(e, 'tx')}
              className="border border-[#7dd3fc] text-[#7dd3fc] font-bold py-3 rounded-lg hover:bg-[#7dd3fc]/10 transition-colors font-mono cursor-pointer"
            >
              Analyze Transaction
            </button>
          </div>
        </div>
      </div>
      <p className="text-[#a3a3a3] text-sm text-center font-mono">
        Cointrack does not store searched addresses or transaction IDs.
      </p>
    </div>
  );
}
