export type RiskLevel = "low" | "medium" | "high";

export type PrivacyGrade = "A" | "B" | "C" | "D" | "F";

export interface AddressPrivacyReport {
  address: string;
  txCount: number;
  reuseCount: number;
  addressReuseRisk: RiskLevel;
  utxoCount: number;
  consolidationRisk: RiskLevel;
  privacyGrade: PrivacyGrade;
  warnings: string[];
  recommendations: string[];
  clusterAddresses?: string[];
}

export interface TransactionPrivacyReport {
  txid: string;
  inputCount: number;
  outputCount: number;
  consolidationRisk: RiskLevel;
  possibleChangeOutput?: string;
  changeConfidence: RiskLevel;
  warnings: string[];
  privacyGrade: PrivacyGrade;
  inputs: { address: string; value: number }[];
  outputs: { address: string; value: number }[];
}
