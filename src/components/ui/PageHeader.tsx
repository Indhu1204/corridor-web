import Link from "next/link";
export default function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: { href: string; label: string } }) {
  return <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 px-5 py-7 sm:px-8"><div>{eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-neutral-500">{eyebrow}</p>}<h1 className="text-3xl font-light tracking-tight sm:text-4xl">{title}</h1><p className="mt-1 max-w-2xl text-sm text-neutral-500">{description}</p></div>{action && <Link href={action.href} className="bg-black px-4 py-2.5 text-sm text-white hover:bg-neutral-700">{action.label}</Link>}</div>;
}
