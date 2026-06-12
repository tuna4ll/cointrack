# Cointrack

Bitcoin privacy analyzer tool.

<img width="1920" height="919" alt="image" src="https://github.com/user-attachments/assets/903f71c5-7259-473d-8a6c-6d6800c8a4d8" />

## Overview
Cointrack analyzes Bitcoin addresses and transactions to detect privacy leaks such as address reuse, UTXO consolidation, and wallet clustering.

## Features
- Address Analysis: Detects reuse and consolidation risks.
- Transaction Analysis: Visualizes flow and identifies change outputs.
- Wallet Clustering: Identifies linked addresses through common input ownership.
- Forensic Fingerprinting: Detects wallet-specific technical signatures and dust attacks.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Technical Stack
- Next.js
- TypeScript
- Tailwind CSS
- Mempool.space API

## Privacy
Cointrack does not store searched addresses, transaction IDs, or any user identifiers. All analysis is performed using public blockchain data.

## Disclaimer
This is an educational tool. It does not provide financial advice or guaranteed deanonymization.
