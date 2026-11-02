// MOCK DATA ONLY. Replace via services/*. Deterministic so dashboard totals stay consistent.
import type { SeriesPoint, Corridor, MarketGroup } from "@/types";
let s = 42; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
export const DAILY: SeriesPoint[] = Array.from({ length: 365 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 10, 2)); d.setUTCDate(d.getUTCDate() - (364 - i));
  const volume = Math.round(38000 + i * 210 + Math.sin(i / 8) * 9000 + rnd() * 9000);
  return { date: d.toISOString().slice(0, 10), volume, settled: Math.round(volume * (0.74 + rnd() * 0.14)), count: Math.max(1, Math.round(volume / 2800)) };
});
export const CORRIDORS: Corridor[] = [
  { pair: "USD→EUR", share: 34, avgCostBps: 118 }, { pair: "USD→INR", share: 27, avgCostBps: 142 },
  { pair: "GBP→USD", share: 17, avgCostBps: 109 }, { pair: "EUR→GBP", share: 13, avgCostBps: 121 }, { pair: "USD→SGD", share: 9, avgCostBps: 133 },
];
export const MARKET: MarketGroup[] = [
  { id: "headline", title: "USD / INR", subtitle: "Headline corridor", rates: [{ pair: "USD/INR", rate: 84.12, changePct: 0.18, source: "Mock" }] },
  { id: "majors", title: "Majors", subtitle: "Major currency pairs", rates: [
    { pair: "EUR/USD", rate: 1.0842, changePct: 0.31, source: "Mock" }, { pair: "GBP/USD", rate: 1.2951, changePct: -0.22, source: "Mock" },
    { pair: "USD/JPY", rate: 151.4, changePct: 0.45, source: "Mock" }, { pair: "USD/SGD", rate: 1.3412, changePct: -0.08, source: "Mock" },
    { pair: "USD/AED", rate: 3.6725, changePct: 0.0, source: "Mock" }] },
  { id: "others", title: "Others · Stablecoins", subtitle: "Peg and cross rates", rates: [
    { pair: "USDC/USD", rate: 1.0001, changePct: 0.01, source: "Mock" }, { pair: "USDT/USD", rate: 0.9997, changePct: -0.02, source: "Mock" },
    { pair: "EUR/INR", rate: 91.2, changePct: 0.52, source: "Mock" }, { pair: "GBP/INR", rate: 108.9, changePct: -0.11, source: "Mock" },
    { pair: "EUR/GBP", rate: 0.8372, changePct: 0.19, source: "Mock" }] },
];
