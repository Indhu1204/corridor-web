"use client";
import Link from "next/link"; import { usePathname } from "next/navigation";
const LINKS = [{ href: "/dashboard", label: "Dashboard" }, { href: "/market-data", label: "Market Data" }];
export default function Frame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-[var(--lime)] p-3 sm:p-8">
      <div className="mx-auto max-w-[1280px] overflow-hidden bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,.35)]">
        <nav className="flex h-14 items-center gap-6 bg-[var(--ink)] px-5 text-[13px] text-neutral-400">
          <span className="grid h-7 w-7 place-items-center bg-[var(--lime)] text-sm font-bold text-black">C</span>
          <div className="flex gap-5">{LINKS.map(l => (
            <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? "text-white" : "hover:text-white"}>{l.label}</Link>))}
          </div>
          <span className="ml-auto border border-neutral-700 px-2 py-1 text-[11px] tracking-wide text-[var(--lime)]">TESTNET · DEMO DATA</span>
        </nav>
        {children}
      </div>
    </div>
  );
}
