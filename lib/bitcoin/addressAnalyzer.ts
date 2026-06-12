import { fetchAddressInfo, fetchAddressUTXOs, fetchAddressTransactions, MempoolAddress, MempoolUTXO, MempoolTransaction } from '../api/mempool';
import { AddressPrivacyReport } from '../types';
import { calculatePrivacyScore, getAddressReuseRisk, getConsolidationRisk } from './scoring';

export async function analyzeAddress(address: string): Promise<AddressPrivacyReport> {
  let info: MempoolAddress;
  let utxos: MempoolUTXO[] = [];
  let txs: MempoolTransaction[] = [];
  let utxoFetchError = false;

  try {
    const [fetchedInfo, fetchedUtxos, fetchedTxs] = await Promise.allSettled([
      fetchAddressInfo(address),
      fetchAddressUTXOs(address),
      fetchAddressTransactions(address)
    ]);

    if (fetchedInfo.status === 'fulfilled') {
      info = fetchedInfo.value;
    } else {
      throw new Error(`Failed to fetch address info: ${fetchedInfo.reason.message}`);
    }

    if (fetchedUtxos.status === 'fulfilled') {
      utxos = fetchedUtxos.value;
    } else {
      utxoFetchError = true;
    }

    if (fetchedTxs.status === 'fulfilled') {
      txs = fetchedTxs.value;
    }
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('An unknown error occurred during analysis');
  }

  const txCount = info.chain_stats.tx_count + info.mempool_stats.tx_count;
  const utxoCount = utxos.length;
  
  let deductions = 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const clusterSet = new Set<string>();
  txs.forEach(tx => {
    const isInput = tx.vin.some(vin => vin.prevout?.scriptpubkey_address === address);
    if (isInput) {
      tx.vin.forEach(vin => {
        const inputAddr = vin.prevout?.scriptpubkey_address;
        if (inputAddr && inputAddr !== address) {
          clusterSet.add(inputAddr);
        }
      });
    }
  });

  const clusterAddresses = Array.from(clusterSet).slice(0, 10);
  if (clusterAddresses.length > 0) {
    deductions += 20;
    warnings.push(`Wallet clustering detected: this address was spent together with ${clusterAddresses.length} other addresses.`);
    recommendations.push('Avoid combining UTXOs from different sources in a single transaction.');
  }

  const reuseRisk = getAddressReuseRisk(txCount);
  if (txCount > 5) {
    deductions += 25;
    warnings.push(`Address reused ${txCount} times (High Risk)`);
    recommendations.push('Stop using this address for new payments.');
  } else if (txCount > 1) {
    deductions += 10;
    warnings.push(`Address reused ${txCount} times (Medium Risk)`);
    recommendations.push('Avoid receiving multiple payments to the same address.');
  }

  const consolidationRisk = getConsolidationRisk(utxoCount);
  if (utxoCount > 5) {
    deductions += 15;
    warnings.push(`High number of UTXOs (${utxoCount}) detected.`);
  }

  if (utxoFetchError) {
    warnings.push('Address contains too many UTXOs for detailed analysis.');
  }

  const { grade } = calculatePrivacyScore(deductions);

  return {
    address,
    txCount,
    reuseCount: txCount,
    addressReuseRisk: reuseRisk,
    utxoCount,
    consolidationRisk,
    privacyGrade: grade,
    warnings,
    recommendations,
    clusterAddresses
  };
}
