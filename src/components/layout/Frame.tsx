"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const GROUPS = [
  { title: "Workspace", links: [{ href: "/dashboard", label: "Overview" }, { href: "/payments", label: "Payments" }, { href: "/settlements", label: "Settlements" }, { href: "/suppliers", label: "Suppliers" }] },
  { title: "Insights", links: [{ href: "/fx-exchange", label: "FX exchange" }, { href: "/market-data", label: "Market data" }, { href: "/wallets", label: "Wallets" }, { href: "/analytics", label: "Analytics" }] },
];

export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--lime)] p-2 sm:p-5 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px] overflow-hidden bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,.35)]">
        <aside className="hidden w-60 shrink-0 flex-col bg-[var(--ink)] text-neutral-300 md:flex">
          <Link href="/dashboard" className="flex h-16 items-center gap-3 border-b border-white/10 px-5 text-white"><span className="grid h-8 w-8 place-items-center bg-[var(--lime)] font-bold text-black">C</span><span className="text-lg font-medium tracking-tight">corridor</span></Link>
          <div className="flex-1 space-y-7 px-3 py-6"><Suspense fallback={<NavSkeleton/>}><SideNavigation/></Suspense></div>
          <div className="border-t border-white/10 px-4 py-4"><Suspense fallback={<Link href="/settings" className="block rounded px-3 py-2 text-sm">Settings</Link>}><SettingsLink/></Suspense><p className="mt-3 px-3 text-[10px] uppercase tracking-wider text-[var(--lime)]">Demo environment</p></div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex min-h-14 flex-wrap items-center gap-2 border-b border-neutral-200 bg-white/95 px-4 backdrop-blur sm:px-6"><Link href="/dashboard" className="mr-2 grid h-8 w-8 place-items-center bg-[var(--lime)] font-bold text-black md:hidden">C</Link><Suspense fallback={<nav className="flex flex-1 gap-1 md:hidden"/>}><MobileNavigation/></Suspense><div className="ml-auto flex items-center gap-2"><span className="border border-neutral-300 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-600">Demo data</span><Link href="/payments/new" className="bg-black px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700">New payment</Link></div></header>
          <main>{children}</main>
          <footer className="border-t border-neutral-200 px-5 py-3 text-[10px] text-neutral-500 sm:px-8">Prototype · All figures and activity are illustrative demo data. No funds move.</footer>
        </div>
      </div>
    </div>
  );
}

function SideNavigation() {
  const path = usePathname();
  return <>{GROUPS.map(group => <div key={group.title}><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-500">{group.title}</p><nav className="space-y-1">{group.links.map(link => { const active = path === link.href || path.startsWith(`${link.href}/`); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`block rounded px-3 py-2 text-sm transition ${active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}>{link.label}</Link>; })}</nav></div>)}</>;
}
function MobileNavigation() {
  const path = usePathname();
  const links = [...GROUPS.flatMap(group => group.links), { href: "/settings", label: "Settings" }];
  return <nav aria-label="Primary navigation" className="flex min-w-0 flex-1 gap-1 overflow-x-auto md:hidden">{links.map(link => { const active = path === link.href || path.startsWith(`${link.href}/`); return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap px-2 py-2 text-xs ${active ? "font-semibold text-black" : "text-neutral-500"}`}>{link.label}</Link>; })}</nav>;
}
function SettingsLink() {
  const path = usePathname();
  const active = path === "/settings" || path.startsWith("/settings/");
  return <Link href="/settings" aria-current={active ? "page" : undefined} className={`block rounded px-3 py-2 text-sm ${active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}>Settings</Link>;
}
function NavSkeleton() { return <div className="h-40" aria-hidden="true"/>; }
