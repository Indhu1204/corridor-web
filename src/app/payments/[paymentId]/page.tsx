"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import DemoNotice from "@/components/ui/DemoNotice";
import StatusBadge from "@/components/payments/StatusBadge";
import { listPayments } from "@/services/payments.service";
import type { Payment } from "@/types";
export default function PaymentDetailPage() {
  return <Suspense fallback={<div className="h-80 animate-pulse bg-neutral-100"/>}><PaymentDetailContent/></Suspense>;
}
function PaymentDetailContent() {
  const params = useParams<{ paymentId: string }>(); const [payment, setPayment] = useState<Payment | null>(null); const [loaded, setLoaded] = useState(false); const [error, setError] = useState("");
  useEffect(() => { let active = true; listPayments().then(r => { if (active) setPayment(r.data.find(p => p.id === params.paymentId) ?? null); }).catch(() => { if (active) setError("Payment details could not be loaded. Please try again."); }).finally(() => { if (active) setLoaded(true); }); return () => { active = false; }; }, [params.paymentId]);
  return <><PageHeader eyebrow="Payments" title={payment?.reference ?? "Payment detail"} description="Review the payment instruction and its separate settlement legs." action={{ href: "/payments", label: "Back to payments" }}/><div className="space-y-6 p-5 sm:p-8"><DemoNotice>Illustrative record. No real provider transaction or bank payout is connected.</DemoNotice>{!loaded ? <div className="h-48 animate-pulse bg-neutral-100"/> : error ? <p role="alert" className="border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</p> : !payment ? <p className="border border-neutral-200 p-8 text-sm text-neutral-500">Payment not found in the current demo fixture.</p> : <><section className="grid gap-4 sm:grid-cols-3"><div className="border border-neutral-200 p-5"><p className="text-xs text-neutral-500">Payment status</p><div className="mt-2"><StatusBadge status={payment.status}/></div></div><div className="border border-neutral-200 p-5"><p className="text-xs text-neutral-500">Source amount</p><p className="mt-2 text-xl">{payment.source.amount} {payment.source.currency}</p></div><div className="border border-neutral-200 p-5"><p className="text-xs text-neutral-500">Destination estimate</p><p className="mt-2 text-xl">{payment.destination.amount} {payment.destination.currency}</p></div></section><section className="border border-neutral-200 p-5 sm:p-7"><h2 className="text-lg">Settlement legs</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><div className="border-l-2 border-[var(--lime-deep)] pl-4"><p className="text-sm font-medium">Stablecoin transfer · {payment.network}</p><div className="mt-2"><StatusBadge status={payment.onchainStatus}/></div><p className="mt-2 text-xs text-neutral-500">{payment.transactionReference ?? "No transaction reference. No transfer submitted."}</p></div><div className="border-l-2 border-neutral-300 pl-4"><p className="text-sm font-medium">Supplier fiat payout</p><div className="mt-2"><StatusBadge status={payment.payoutStatus}/></div><p className="mt-2 text-xs text-neutral-500">A confirmed stablecoin transfer does not confirm a bank payout.</p></div></div></section><p className="text-xs text-neutral-500">Created {new Date(payment.createdAt).toLocaleString()} · {payment.beneficiaryName} · {payment.asset}</p><Link href="/settlements" className="text-sm underline underline-offset-4">Open settlements</Link></>}</div></>;
}
