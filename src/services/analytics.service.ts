import { DAILY, CORRIDORS } from "@/mocks/data";
import type { APIResponse, AnalyticsSummary, RangeKey } from "@/types";
const DAYS: Record<RangeKey, number> = { week: 7, month: 30, quarter: 90, half: 182, year: 365 };
const sum = (points: { volume: number }[]) => points.reduce((total, point) => total + point.volume, 0);
export async function getAnalytics(range: RangeKey): Promise<APIResponse<AnalyticsSummary>> {
  const n = DAYS[range], current = DAILY.slice(-n), previous = DAILY.slice(-2 * n, -n);
  const totalVolume = sum(current), settled = current.reduce((total, point) => total + point.settled, 0);
  const changePct = previous.length ? ((totalVolume - sum(previous)) / sum(previous)) * 100 : 0;
  const recent = DAILY.slice(-91);
  const growth = recent.slice(1).map((point, index) => ({ date: point.date, delta: point.volume - recent[index].volume }));
  return { data: { totalVolume, changePct, payments: current.reduce((total, point) => total + point.count, 0), settledOnChain: settled, pending: null,
    estimatedSavings: null, series: current, growth, corridors: CORRIDORS },
    meta: { source: "Illustrative demo fixture", updatedAt: new Date().toISOString(), isMock: true } };
}
