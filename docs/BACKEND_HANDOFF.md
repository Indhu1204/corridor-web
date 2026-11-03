# Backend handoff

## Phase 1 boundary

The current application is a frontend prototype. `src/services` reads isolated demo fixtures; no Supabase, provider, wallet, chain, or payout integration exists. The new payment form creates a browser-memory instruction with status `created`; it resets on reload and does not execute or persist a payment. Its destination currency follows the selected supplier. All fixture values must stay labelled as demo.

## Recommended server boundaries

```text
Next.js Route Handler (HTTP validation/authentication)
  → feature service (business rules/state transitions)
    → repository (tenant-scoped persistence)
    → server-only provider adapter (external calls)
```

Keep UI presentation, browser API client, backend business logic, persistence, and external providers separate. For server-rendered pages, Next.js’s installed guidance recommends reading the source directly through server-side services rather than making an HTTP request back into the application’s own Route Handler. Route Handlers are public endpoints and every request must be validated and authorized.

## Proposed persistence

- `organizations`, `organization_members`: tenant boundary, membership, roles.
- `beneficiaries`: organization-owned supplier profile plus minimal/tokenized payout destination reference; avoid unnecessary raw bank data.
- `fx_quotes`: currencies, decimal amounts, rate, fees, source, provider reference, quoted/expiry time, status.
- `payments`: organization, beneficiary, quote, source/destination amounts, asset/network, overall status, idempotency key, provider references. Unique `(organization_id, idempotency_key)`.
- `payment_events`: append-only transition history and actor/source.
- `chain_transactions`: token/network/hash/raw token units/confirmation status, separate from payout.
- `fiat_payouts`: separate provider reference, currency/amount, status, failure/reconciliation information. Populate only when an actual payout capability is selected and connected.
- `provider_webhook_events`: unique provider event ID, signature result, receipt and processing status for replay-safe handling.
- `audit_logs`: actor, tenant, action, resource, request ID and redacted metadata.

Use decimal-safe arithmetic and explicit currency/token precision. Apply and test Supabase RLS tenant isolation. A server-side service role key must never reach the browser.

## Provider integration gates

1. Select and verify a Circle product, account eligibility, supported asset/network, test environment, custody/signing approach, and required webhook verification.
2. Decide whether the quote provider is a true executable FX provider or an indicative reference source. A Chainlink feed does not itself guarantee fiat FX execution or a payout rate; validate asset/network/feed coverage and freshness.
3. Add CCIP only if a supported cross-chain token/message route is required and both networks and assets are verified. It is neither FX nor fiat payout.
4. Select a separate payout capability if supplier bank payment is in scope; verify country coverage, compliance requirements, reversals, and sandbox behavior.
5. Isolate testnet settings and credentials server-side. No real-fund path in the prototype.

No provider capabilities are assumed by the current UI. Validate against provider documentation and account access before implementation.

## Operational requirements

- Idempotency keys for create and submit operations; unique constraints as final guard.
- Validate organization membership, quote expiry, amounts, beneficiary state, limits, allowed networks/contracts, and request size at the server.
- Verify webhook signatures and replay controls, persist unique event IDs, and reconcile callbacks with provider state.
- Model failure and delayed states explicitly; add a reconciliation queue and operational alerts.
- Use timeouts and bounded retries only where a retry cannot duplicate an irreversible operation.
- Record state transitions and audit events transactionally where possible. Redact secrets and sensitive payment details from logs.
- Disable shared caching for user-specific payment and quote data; configure Node.js runtime as required by Cache Components.

## Suggested delivery sequence

1. Agree on provider, quote, custody/signing, payout and jurisdiction scope.
2. Finalize types and transition rules in `docs/API_CONTRACTS.md`.
3. Create migrations, RLS, authentication, organization authorization, and repository interfaces.
4. Add read-only APIs and replace the frontend mock provider only when a backend source is available; preserve explicit demo mode.
5. Add quote persistence, expiry, payment drafts, idempotency, and audit events.
6. Add testnet transaction submission, signed webhooks, and reconciliation.
7. Implement fiat payout as an independent capability with its own status and sandbox verification.
8. Add monitoring, operational runbooks, security review, and deployment checks.

## Verification expectations

Test state transitions, duplicate requests, expired quotes, provider timeouts, webhook signature failures/replays, tenant isolation and RLS. End-to-end tests should verify that on-chain confirmation never completes a fiat payout. Use provider sandboxes/testnets only and ensure no real funds are used during prototype testing.
