"use client";
import { useEffect, useState } from "react";
import { getMarketGroups } from "@/services/fx.service";
import type { MarketGroup } from "@/types";
const Tag = ({ v }: { v: number }) => <span className={`px-1.5 py-0.5 text-[11px] font-medium ${v > 0 ? "bg-[var(--lime)] text-black" : v < 0 ? "bg-[var(--neg)] text-white" : "bg-neutral-200"}`}>{v > 0 ? "+" : ""}{v.toFixed(2)}%</span>;
export default function MarketData() {
  const [g, setG] = useState<MarketGroup[]>([]); const [q, setQ] = useState("");
  useEffect(() => { getMarketGroups().then(r => setG(r.data)); }, []);
  const f = (x: MarketGroup) => x.rates.filter(r => r.pair.toLowerCase().includes(q.toLowerCase()));
  return (<div className="p-4 sm:p-6">
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter pairs, e.g. INR" className="border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-black" />
      <span className="ml-auto text-[11px] text-neutral-500">MOCK VALUES · not market data · updated 2026-11-02 06:30 UTC</span>
    </div>
    <div className="grid gap-px bg-neutral-200 md:grid-cols-[1fr_1.2fr_1fr]">{g.map(x => (
      <section key={x.id} className={`p-5 ${x.id === "headline" ? "bg-gradient-to-b from-[#c9f08f] via-white to-white md:min-h-[420px]" : "bg-white"}`}>
        <h2 className="text-xl font-light">{x.title}</h2><p className="text-xs text-neutral-500">{x.subtitle}</p>
        {x.id === "headline" ? <p className="mt-24 text-5xl font-light">{x.rates[0].rate.toFixed(2)}<span className="ml-2 align-middle"><Tag v={x.rates[0].changePct} /></span></p> :
          <ul className="mt-4 divide-y divide-neutral-100">{f(x).map(r => (
            <li key={r.pair} className="flex items-center justify-between py-3"><span>{r.pair}</span><span className="flex items-center gap-3 text-lg">{r.rate.toLocaleString("en-US", { maximumFractionDigits: 4 })}<Tag v={r.changePct} /></span></li>))}
            {!f(x).length && <li className="py-6 text-sm text-neutral-400">No pairs match.</li>}</ul>}
      </section>))}</div>
  </div>);
}
