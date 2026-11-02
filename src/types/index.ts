export interface APIResponse<T> { data: T; error?: { code: string; message: string }; meta?: { source: string; updatedAt: string; isMock: boolean } }
export type RangeKey = "week" | "month" | "quarter" | "half" | "year";
export interface SeriesPoint { date: string; volume: number; settled: number; count: number }
export interface Corridor { pair: string; share: number; avgCostBps: number }
export interface AnalyticsSummary {
  totalVolume: number; changePct: number; payments: number; settledOnChain: number; pending: number;
  estimatedSavings: number; series: SeriesPoint[]; growth: { date: string; delta: number }[]; corridors: Corridor[];
}
export interface FXRate { pair: string; rate: number; changePct: number; source: string }
export interface MarketGroup { id: "headline" | "majors" | "others"; title: string; subtitle: string; rates: FXRate[] }
