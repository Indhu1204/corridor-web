export default function DemoNotice({ children = "Illustrative demo data. Not live market data or a financial instruction." }: { children?: string }) {
  return <div className="border border-[#d7eabf] bg-[#f4faeb] px-4 py-3 text-xs leading-relaxed text-neutral-700"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--lime-deep)]" />{children}</div>;
}
