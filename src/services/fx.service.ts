// Demo provider. Replace behind this interface with a backend API client when one exists.
import { MARKET } from "@/mocks/data";
import type { APIResponse, MarketGroup } from "@/types";
export async function getMarketGroups(): Promise<APIResponse<MarketGroup[]>> {
  return { data: MARKET, meta: { source: "Illustrative demo fixture", updatedAt: new Date().toISOString(), isMock: true } };
}
