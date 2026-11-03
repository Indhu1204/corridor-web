"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import DemoNotice from "@/components/ui/DemoNotice";
import { createDemoPayment, getIndicativeQuote, listBeneficiaries, parseDemoUsdAmount, type IndicativeQuote } from "@/services/payments.service";
import type { Beneficiary, CurrencyCode, Payment } from "@/types";

export default function NewPaymentPage() {
  const [suppliers, setSuppliers] = useState<Beneficiary[]>([]);
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [quote, setQuote] = useState<IndicativeQuote | null>(null);
  const [created, setCreated] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    listBeneficiaries()
      .then(result => {
        if (!active) return;
        setSuppliers(result.data);
        setBeneficiaryId(result.data[0]?.id ?? "");
        setCurrency(result.data[0]?.currency ?? "INR");
      })
      .catch(() => { if (active) setError("Suppliers could not be loaded. Please try again."); });
    return () => { active = false; };
  }, []);

  const selectedSupplier = suppliers.find(item => item.id === beneficiaryId);
  const review = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setQuote(null);
    const value = parseDemoUsdAmount(amount);
    if (value === null) {
      setError("Enter an amount with up to two decimal places, greater than 0 and no more than $1,000,000.");
      return;
    }
    if (!beneficiaryId) {
      setError("Select a supplier before continuing.");
      return;
    }
    setLoading(true);
    try {
      const result = await getIndicativeQuote(value.toFixed(2), currency);
      setQuote(result.data);
    } catch {
      setError("An indicative preview could not be prepared.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDemo = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await createDemoPayment({ amount, beneficiaryId, destinationCurrency: currency });
      setCreated(result.data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create the demo payment.");
    } finally {
      setLoading(false);
    }
  };

  return <>
    <PageHeader eyebrow="Payments" title="Create payment" description="Review an illustrative conversion preview and save a local demo payment instruction." action={{ href: "/payments", label: "Payment history" }} />
    <div className="mx-auto max-w-3xl space-y-6 p-5 sm:p-8">
      <DemoNotice>This prototype does not execute transfers, lock an FX rate, or initiate a bank payout. Instructions exist only in browser memory and reset on reload.</DemoNotice>
      {!loading && !error && suppliers.length === 0 && <p className="border border-neutral-200 p-4 text-sm text-neutral-600">No suppliers are available. Add a demo supplier from the <Link href="/suppliers" className="underline underline-offset-4">Suppliers page</Link>.</p>}
      {created ? <section className="border border-neutral-200 p-6">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Demo instruction created</p>
        <h2 className="mt-2 text-2xl font-light">{created.reference}</h2>
        <p className="mt-2 text-sm text-neutral-600">Status: created. No transaction was submitted and no supplier payout was initiated.</p>
        <Link href="/payments" className="mt-5 inline-block bg-black px-4 py-2 text-sm text-white">View payment history</Link>
      </section> : <>
        <form onSubmit={review} className="space-y-5 border border-neutral-200 p-5 sm:p-7">
          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium">You send</label>
            <div className="flex">
              <span className="grid place-items-center border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm">USD</span>
              <input id="amount" type="number" min="0.01" max="1000000" step="0.01" required inputMode="decimal" value={amount} onChange={event => { setAmount(event.target.value); setQuote(null); }} placeholder="0.00" className="min-w-0 flex-1 border border-neutral-300 px-3 py-3 text-lg outline-none focus:border-black" />
            </div>
          </div>
          <div>
            <label htmlFor="supplier" className="mb-1 block text-sm font-medium">Supplier</label>
            <select id="supplier" required value={beneficiaryId} onChange={event => {
              const nextId = event.target.value;
              setBeneficiaryId(nextId);
              setCurrency(suppliers.find(item => item.id === nextId)?.currency ?? "INR");
              setQuote(null);
            }} className="w-full border border-neutral-300 bg-white px-3 py-3 text-sm">
              {suppliers.map(item => <option key={item.id} value={item.id}>{item.company} - {item.country}</option>)}
            </select>
            {selectedSupplier && <p className="mt-1 text-xs text-neutral-500">Payout currency: {selectedSupplier.currency} · {selectedSupplier.bankLabel}</p>}
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={loading || suppliers.length === 0} className="w-full bg-black px-4 py-3 text-sm text-white disabled:opacity-50">{loading ? "Preparing..." : "Review indicative preview"}</button>
        </form>
        {quote && <section className="space-y-4 border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Indicative preview - demo</p>
            <p className="mt-2 text-3xl font-light">{quote.destinationAmount} {quote.destinationCurrency}</p>
            <p className="text-sm text-neutral-500">Estimated from {quote.sourceAmount} USD at {quote.rate} {quote.destinationCurrency}/USD</p>
          </div>
          <dl className="grid gap-3 border-y border-neutral-200 py-4 text-sm sm:grid-cols-2">
            <div><dt className="text-neutral-500">Illustrative fee assumption</dt><dd className="mt-1">{quote.estimatedFee} USD (1%)</dd></div>
            <div><dt className="text-neutral-500">Settlement asset for demo record</dt><dd className="mt-1">USDC - Sepolia</dd></div>
          </dl>
          <p className="text-xs text-neutral-500">{quote.disclaimer}</p>
          <button onClick={confirmDemo} disabled={loading} className="w-full bg-[var(--lime)] px-4 py-3 text-sm font-medium text-black disabled:opacity-50">{loading ? "Saving..." : "Create demo instruction"}</button>
        </section>}
      </>}
    </div>
  </>;
}
