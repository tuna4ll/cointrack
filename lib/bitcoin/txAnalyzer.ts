import { fetchTransaction } from '../api/mempool';
import { TransactionPrivacyReport, RiskLevel } from '../types';
import { calculatePrivacyScore, getConsolidationRisk } from './scoring';

export async function analyzeTransaction(txid: string): Promise<TransactionPrivacyReport> {
  const tx = await fetchTransaction(txid);

  const inputCount = tx.vin.length;
  const outputCount = tx.vout.length;
  
  let deductions = 0;
  const warnings: string[] = [];
  
  const inputs = tx.vin.map(vin => ({
    address: vin.prevout?.scriptpubkey_address || 'Unknown',
    value: vin.prevout?.value || 0
  }));

  const outputs = tx.vout.map(vout => ({
    address: vout.scriptpubkey_address || 'Unknown',
    value: vout.value || 0
  }));

  const consolidationRisk = getConsolidationRisk(inputCount);
  if (inputCount > 5) {
    deductions += 25;
    warnings.push(`${inputCount} inputs consolidated (High Risk)`);
  } else if (inputCount > 1) {
    deductions += 10;
    warnings.push(`${inputCount} inputs consolidated (Medium Risk)`);
  }

  const version = tx.version;
  const locktime = tx.locktime;
  
  const isDust = outputs.some((out: { address: string; value: number }) => out.value > 0 && out.value <= 546);
  if (isDust) {
    deductions += 15;
    warnings.push('Dust output detected: possible tracking attempt (Dust Attack).');
  }

  if (locktime > 0) {
    warnings.push(`nLockTime: ${locktime} (Anti-fee-sniping wallet behavior)`);
  }

  if (version === 2) {
    warnings.push('BIP-68 Sequence Locks (Version 2) detected.');
  }

  let possibleChangeOutput = '';
  let changeConfidence: RiskLevel = 'low';

  if (outputCount === 2) {
    const vout0 = outputs[0];
    const vout1 = outputs[1];
    
    const isRound0 = vout0.value % 10000 === 0;
    const isRound1 = vout1.value % 10000 === 0;

    if (isRound0 && !isRound1) {
      possibleChangeOutput = vout1.address;
      changeConfidence = 'medium';
      warnings.push('Possible change output detected via round-number heuristic.');
      deductions += 10;
    } else if (!isRound0 && isRound1) {
      possibleChangeOutput = vout0.address;
      changeConfidence = 'medium';
      warnings.push('Possible change output detected via round-number heuristic.');
      deductions += 10;
    }
  }

  const { grade } = calculatePrivacyScore(deductions);

  return {
    txid,
    inputCount,
    outputCount,
    consolidationRisk,
    possibleChangeOutput: possibleChangeOutput || undefined,
    changeConfidence,
    warnings,
    privacyGrade: grade,
    inputs,
    outputs
  };
}
