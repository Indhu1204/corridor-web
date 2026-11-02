// Swap the body for a real call (e.g. GET /api/v1/analytics/summary?range=). Keep the signature.
import { DAILY, CORRIDORS } from "@/mocks/data";
import type { APIResponse, AnalyticsSummary, RangeKey } from "@/types";
const DAYS: Record<RangeKey, number> = { week: 7, month: 30, quarter: 90, half: 182, year: 365 };
const sum = (a: { volume: number }[]) => a.reduce((t, p) => t + p.volume, 0);
export async function getAnalytics(range: RangeKey): Promise<APIResponse<AnalyticsSummary>> {
  const n = DAYS[range], cur = DAILY.slice(-n), prev = DAILY.slice(-2 * n, -n);
  const totalVolume = sum(cur), settled = cur.reduce((t, p) => t + p.settled, 0);
  const changePct = prev.length ? ((totalVolume - sum(prev)) / sum(prev)) * 100 : 0;
  const growth = DAILY.slice(-91).slice(1).map((p, i) => ({ date: p.date, delta: p.volume - DAILY.slice(-91)[i].volume }));
  return { data: { totalVolume, changePct, payments: cur.reduce((t, p) => t + p.count, 0), settledOnChain: settled, pending: totalVolume - settled,
    estimatedSavings: totalVolume * (0.06 - 0.0125), series: cur, growth, corridors: CORRIDORS },
    meta: { source: "mock", updatedAt: "2026-11-02T00:00:00Z", isMock: true } };
}
