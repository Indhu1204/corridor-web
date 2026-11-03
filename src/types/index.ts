export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "SGD" | "JPY" | "AED";
export type PaymentStatus = "created" | "submitted" | "onchain_pending" | "onchain_confirmed" | "fiat_payout_pending" | "fiat_payout_completed" | "failed" | "reconciliation_required";
export type PaymentRailStatus = "not_started" | "pending" | "confirmed" | "completed" | "failed" | "reconciliation_required";
export interface Money { amount: string; currency: CurrencyCode }
export interface APIResponse<T> { data: T; error?: { code: string; message: string; fieldErrors?: Record<string, string> }; meta?: { source: string; updatedAt: string; isMock: boolean; requestId?: string } }
export type RangeKey = "week" | "month" | "quarter" | "half" | "year";
export interface SeriesPoint { date: string; volume: number; settled: number; count: number }
export interface Corridor { pair: string; share: number; avgCostBps: number }
export interface AnalyticsSummary {
  totalVolume: number; changePct: number; payments: number; settledOnChain: number; pending: null;
  estimatedSavings: number | null; series: SeriesPoint[]; growth: { date: string; delta: number }[]; corridors: Corridor[];
}
export interface FXRate { pair: string; rate: number; changePct: number; source: string }
export interface MarketGroup { id: "headline" | "majors" | "others"; title: string; subtitle: string; rates: FXRate[] }
export interface Beneficiary { id: string; name: string; company: string; country: string; currency: CurrencyCode; destinationStatus: "verified_demo" | "pending_review" | "not_configured"; bankLabel: string }
export interface Payment { id: string; reference: string; beneficiaryId: string; beneficiaryName: string; createdAt: string; source: Money; destination: Money; asset: "USDC" | "USDT"; network: string; status: PaymentStatus; onchainStatus: PaymentRailStatus; payoutStatus: PaymentRailStatus; transactionReference: string | null }
