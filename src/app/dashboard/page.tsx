"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, ComposedChart, Area, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getAnalytics } from "@/services/analytics.service";
import type { AnalyticsSummary, RangeKey } from "@/types";
const RANGES: [RangeKey, string][] = [["week", "Week"], ["month", "Month"], ["quarter", "Quarter"], ["half", "Half Year"], ["year", "Year"]];
const usd = (n: number, d = 0) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d, minimumFractionDigits: d });
export default function Dashboard() {
  const [range, setRange] = useState<RangeKey>("month");
  const [d, setD] = useState<AnalyticsSummary | null>(null);
  useEffect(() => { getAnalytics(range).then(r => setD(r.data)); }, [range]);
  if (!d) return <div className="h-[640px] animate-pulse bg-neutral-100" />;
  const [whole, cents] = d.totalVolume.toFixed(2).split(".");
  const max = Math.max(...d.series.map(p => p.count));
  return (<>
    <section className="px-6 pt-8 sm:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-5xl font-light tracking-tight sm:text-7xl">${Number(whole).toLocaleString("en-US")}<span className="text-neutral-400">.{cents}</span></h1>
            <span className={`px-1.5 py-0.5 text-xs font-medium ${d.changePct >= 0 ? "bg-[var(--lime)] text-black" : "bg-[var(--neg)] text-white"}`}>{d.changePct >= 0 ? "+" : ""}{d.changePct.toFixed(1)}%</span>
          </div>
          <p className="mt-1 text-lg text-neutral-600">Total payment volume · USD <span className="text-sm text-neutral-400">({d.payments} payments)</span></p>
        </div>
        <div className="flex border border-neutral-300 text-xs">{RANGES.map(([k, l]) => (
          <button key={k} onClick={() => setRange(k)} className={`px-3 py-1.5 ${range === k ? "bg-black text-white" : "hover:bg-neutral-100"}`}>{l}</button>))}</div>
      </div>
      <div className="mt-4 h-[360px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={d.series} margin={{ left: -10, right: 10 }}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd83a" stopOpacity={.45} /><stop offset="1" stopColor="#8fd83a" stopOpacity={.02} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="#eee" />
            <XAxis dataKey="date" tickFormatter={s => s.slice(5)} tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} minTickGap={32} />
            <YAxis yAxisId="v" orientation="right" tickFormatter={v => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="c" hide domain={[0, max * 4]} />
            <Tooltip contentStyle={{ background: "#0b0b0b", border: 0, color: "#fff", fontSize: 12 }} formatter={(v, n) => n === "count" ? [v, "Payments"] : [usd(Number(v)), n === "volume" ? "Initiated" : "Stablecoin leg settled"]} />
            <Bar yAxisId="c" dataKey="count" fill="#d9d9d9" />
            <Area yAxisId="v" dataKey="volume" stroke="#6fb81c" strokeWidth={2} fill="url(#g)" />
            <Line yAxisId="v" dataKey="settled" stroke="#0b0b0b" strokeWidth={1.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
    <section className="grid md:grid-cols-[1.05fr_1fr]">
      <div className="bg-[var(--ink)] p-6 text-white sm:px-10">
        <div className="flex justify-between"><h2 className="text-xl font-light">Volume Changes</h2><span className="text-[11px] text-neutral-400">Last 90 days</span></div>
        <div className="mt-3 flex gap-4 text-[11px] text-neutral-400">{[["Growth", "var(--lime)"], ["Decline", "var(--neg)"], ["No change", "var(--warn)"]].map(([l, c]) => <span key={l}><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: c }} />{l}</span>)}</div>
        <div className="mt-5 flex h-10 items-end gap-[2px]">{d.growth.map(g => (
          <i key={g.date} title={`${g.date}: ${g.delta >= 0 ? "+" : ""}${usd(g.delta)}`} className="flex-1" style={{ height: `${30 + Math.min(70, Math.abs(g.delta) / 150)}%`, background: Math.abs(g.delta) < 150 ? "var(--warn)" : g.delta > 0 ? "var(--lime)" : "var(--neg)" }} />))}</div>
        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div><dt className="text-neutral-400">Stablecoin leg settled</dt><dd className="text-lg">{usd(d.settledOnChain)}</dd></div>
          <div><dt className="text-neutral-400">In progress</dt><dd className="text-lg">{usd(d.pending)}</dd></div>
          <div><dt className="text-neutral-400">Est. savings</dt><dd className="text-lg text-[var(--lime)]">{usd(d.estimatedSavings)}</dd></div>
        </dl>
      </div>
      <div className="bg-neutral-100 p-6 sm:px-10">
        <h2 className="text-xl font-light">Corridors</h2>
        <ul className="mt-4 space-y-2.5">{d.corridors.map(c => (
          <li key={c.pair} className="grid grid-cols-[80px_1fr_70px] items-center gap-3 text-sm">
            <span>{c.pair}</span><span className="h-2 bg-neutral-200"><i className="block h-full bg-[var(--lime)]" style={{ width: `${c.share * 2.5}%` }} /></span>
            <span className="text-right text-neutral-500">{c.share}% · {(c.avgCostBps / 100).toFixed(2)}%</span></li>))}</ul>
        <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">Demo data. Savings are modelled against a 6% bank benchmark. “Settled” refers to the stablecoin transfer only; fiat payout is simulated.</p>
      </div>
    </section>
  </>);
}
