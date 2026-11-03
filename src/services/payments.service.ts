import { BENEFICIARIES, PAYMENTS } from "@/mocks/data";
import type { APIResponse, Beneficiary, CurrencyCode, Payment } from "@/types";

export async function listPayments(): Promise<APIResponse<Payment[]>> {
  return { data: [...PAYMENTS], meta: { source: "Illustrative demo fixtures", updatedAt: new Date().toISOString(), isMock: true } };
}
export async function listBeneficiaries(): Promise<APIResponse<Beneficiary[]>> {
  return { data: [...BENEFICIARIES], meta: { source: "Illustrative demo fixtures", updatedAt: new Date().toISOString(), isMock: true } };
}
export interface IndicativeQuote { sourceAmount: string; sourceCurrency: CurrencyCode; destinationAmount: string; destinationCurrency: CurrencyCode; rate: string; estimatedFee: string; disclaimer: string; quoteId?: string; source?: string; quotedAt?: string; expiresAt?: string }
const DEMO_RATES: Partial<Record<CurrencyCode, number>> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 84.12, SGD: 1.34, JPY: 151.4, AED: 3.67 };
export function parseDemoUsdAmount(value: string): number | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= 1000000 ? amount : null;
}
export async function getIndicativeQuote(amount: string, destinationCurrency: CurrencyCode): Promise<APIResponse<IndicativeQuote>> {
  const numeric = parseDemoUsdAmount(amount);
  if (numeric === null) throw new Error("Enter an amount with up to two decimal places, greater than 0 and no more than 1,000,000 USD.");
  const rate = DEMO_RATES[destinationCurrency] ?? 1;
  const destinationAmount = numeric * rate * 0.99;
  return { data: { sourceAmount: amount, sourceCurrency: "USD", destinationAmount: destinationAmount.toFixed(2), destinationCurrency, rate: rate.toString(), estimatedFee: (numeric * 0.01).toFixed(2), disclaimer: "Illustrative demo estimate only. Not an executable quote; no conversion or transfer occurs." }, meta: { source: "Illustrative demo formula", updatedAt: new Date().toISOString(), isMock: true } };
}
export async function createDemoPayment(input: { amount: string; beneficiaryId: string; destinationCurrency: CurrencyCode }): Promise<APIResponse<Payment>> {
  const beneficiary = BENEFICIARIES.find(item => item.id === input.beneficiaryId);
  if (!beneficiary) throw new Error("Choose a supplier from the list.");
  const amount = parseDemoUsdAmount(input.amount);
  if (amount === null) throw new Error("Enter an amount with up to two decimal places, greater than 0 and no more than 1,000,000 USD.");
  const quoteResponse = await getIndicativeQuote(input.amount, input.destinationCurrency);
  const now = new Date().toISOString();
  const record: Payment = { id: `demo-${Date.now()}`, reference: `DEMO-${Date.now().toString().slice(-6)}`, beneficiaryId: beneficiary.id, beneficiaryName: beneficiary.company, createdAt: now,
    source: { amount: amount.toFixed(2), currency: "USD" }, destination: { amount: quoteResponse.data.destinationAmount, currency: input.destinationCurrency }, asset: "USDC", network: "Sepolia · demo", status: "created", onchainStatus: "not_started", payoutStatus: "not_started", transactionReference: null };
  PAYMENTS.unshift(record);
  return { data: record, meta: { source: "Local in-memory demo", updatedAt: now, isMock: true } };
}
