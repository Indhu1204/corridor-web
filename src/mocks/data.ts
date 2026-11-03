// Illustrative fixtures only. They contain no provider records, real hashes, or bank payout confirmations.
import type { Beneficiary, Corridor, MarketGroup, Payment, SeriesPoint } from "@/types";

let seed = 42;
const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const today = new Date();
export const DAILY: SeriesPoint[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  date.setUTCDate(date.getUTCDate() - (364 - i));
  const volume = Math.round(38000 + i * 210 + Math.sin(i / 8) * 9000 + random() * 9000);
  return { date: date.toISOString().slice(0, 10), volume, settled: Math.round(volume * (0.74 + random() * 0.14)), count: Math.max(1, Math.round(volume / 2800)) };
});
export const CORRIDORS: Corridor[] = [
  { pair: "USD → EUR", share: 34, avgCostBps: 118 }, { pair: "USD → INR", share: 27, avgCostBps: 142 },
  { pair: "GBP → USD", share: 17, avgCostBps: 109 }, { pair: "EUR → GBP", share: 13, avgCostBps: 121 }, { pair: "USD → SGD", share: 9, avgCostBps: 133 },
];
export const MARKET: MarketGroup[] = [
  { id: "headline", title: "USD / INR", subtitle: "Headline corridor · indicative demo rate", rates: [{ pair: "USD/INR", rate: 84.12, changePct: 0.18, source: "Illustrative demo" }] },
  { id: "majors", title: "Majors", subtitle: "Illustrative currency pairs", rates: [
    { pair: "EUR/USD", rate: 1.0842, changePct: 0.31, source: "Illustrative demo" }, { pair: "GBP/USD", rate: 1.2951, changePct: -0.22, source: "Illustrative demo" },
    { pair: "USD/JPY", rate: 151.4, changePct: 0.45, source: "Illustrative demo" }, { pair: "USD/SGD", rate: 1.3412, changePct: -0.08, source: "Illustrative demo" },
    { pair: "USD/AED", rate: 3.6725, changePct: 0, source: "Illustrative demo" }] },
  { id: "others", title: "Other pairs", subtitle: "Stablecoin pegs and cross rates · illustrative", rates: [
    { pair: "USDC/USD", rate: 1.0001, changePct: 0.01, source: "Illustrative demo" }, { pair: "USDT/USD", rate: 0.9997, changePct: -0.02, source: "Illustrative demo" },
    { pair: "EUR/INR", rate: 91.2, changePct: 0.52, source: "Illustrative demo" }, { pair: "GBP/INR", rate: 108.9, changePct: -0.11, source: "Illustrative demo" },
    { pair: "EUR/GBP", rate: 0.8372, changePct: 0.19, source: "Illustrative demo" }] },
];
export const BENEFICIARIES: Beneficiary[] = [
  { id: "sup-001", name: "Aarav Mehta", company: "Mehta Textiles Pvt Ltd", country: "India", currency: "INR", destinationStatus: "verified_demo", bankLabel: "Bank destination · demo record" },
  { id: "sup-002", name: "Sophie Laurent", company: "Atelier Laurent SAS", country: "France", currency: "EUR", destinationStatus: "pending_review", bankLabel: "Destination review pending" },
  { id: "sup-003", name: "Oliver Chen", company: "Pacific Components Ltd", country: "Singapore", currency: "SGD", destinationStatus: "verified_demo", bankLabel: "Bank destination · demo record" },
  { id: "sup-004", name: "Amira Hassan", company: "Gulf Supply Trading", country: "United Arab Emirates", currency: "AED", destinationStatus: "not_configured", bankLabel: "No payout destination configured" },
];
const payment = (id: string, beneficiaryId: string, daysAgo: number, source: string, currency: "INR" | "EUR" | "SGD" | "AED", status: Payment["status"], onchainStatus: Payment["onchainStatus"], payoutStatus: Payment["payoutStatus"]): Payment => {
  const beneficiary = BENEFICIARIES.find(item => item.id === beneficiaryId)!;
  const created = new Date(); created.setDate(created.getDate() - daysAgo);
  return { id, reference: `DEMO-${id.toUpperCase()}`, beneficiaryId, beneficiaryName: beneficiary.company, createdAt: created.toISOString(), source: { amount: source, currency: "USD" }, destination: { amount: (Number(source) * ({ INR: 84.12, EUR: 0.92, SGD: 1.34, AED: 3.67 }[currency])).toFixed(2), currency }, asset: "USDC", network: "Sepolia · demo", status, onchainStatus, payoutStatus, transactionReference: null };
};
export const PAYMENTS: Payment[] = [
  payment("p-2408", "sup-001", 1, "12500.00", "INR", "fiat_payout_pending", "confirmed", "pending"),
  payment("p-2407", "sup-003", 3, "8400.00", "SGD", "onchain_pending", "pending", "not_started"),
  payment("p-2406", "sup-002", 5, "6200.00", "EUR", "created", "not_started", "not_started"),
  payment("p-2405", "sup-001", 8, "3200.00", "INR", "reconciliation_required", "confirmed", "reconciliation_required"),
  payment("p-2404", "sup-004", 12, "9800.00", "AED", "failed", "failed", "not_started"),
  payment("p-2403", "sup-003", 15, "5100.00", "SGD", "submitted", "pending", "not_started"),
  payment("p-2402", "sup-002", 19, "4500.00", "EUR", "fiat_payout_pending", "confirmed", "pending"),
  payment("p-2401", "sup-001", 22, "7700.00", "INR", "onchain_confirmed", "confirmed", "not_started"),
];
