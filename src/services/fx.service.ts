// Swap for GET /api/v1/fx/rates (Chainlink + fallback provider, with provenance).
import { MARKET } from "@/mocks/data";
import type { APIResponse, MarketGroup } from "@/types";
export async function getMarketGroups(): Promise<APIResponse<MarketGroup[]>> {
  return { data: MARKET, meta: { source: "mock", updatedAt: "2026-11-02T06:30:00Z", isMock: true } };
}
