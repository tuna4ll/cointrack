const MEMPOOL_API_BASE = 'https://mempool.space/api';

export interface MempoolAddress {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

export interface MempoolUTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

export interface MempoolTransaction {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey_address: string;
      value: number;
    } | null;
    scriptsig: string;
    scriptsig_asm: string;
    witness?: string[];
    is_coinbase: boolean;
    sequence: number;
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  }>;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

export async function fetchAddressInfo(address: string): Promise<MempoolAddress> {
  const response = await fetch(`${MEMPOOL_API_BASE}/address/${address}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch address info: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAddressUTXOs(address: string): Promise<MempoolUTXO[]> {
  const response = await fetch(`${MEMPOOL_API_BASE}/address/${address}/utxo`);
  if (!response.ok) {
    throw new Error(`Failed to fetch address UTXOs: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAddressTransactions(address: string): Promise<MempoolTransaction[]> {
  const response = await fetch(`${MEMPOOL_API_BASE}/address/${address}/txs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch address transactions: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTransaction(txid: string): Promise<MempoolTransaction> {
  const response = await fetch(`${MEMPOOL_API_BASE}/tx/${txid}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Transaction not found');
    throw new Error(`Failed to fetch transaction: ${response.statusText}`);
  }
  return response.json();
}
