# Frontend API contracts

These are proposed contracts for the future backend. There are no API routes or connected integrations in Phase 1. Amounts are decimal strings; IDs and provider references are opaque. Responses for user-specific financial data should be non-cacheable and include a request ID.

## Existing frontend service models

The current mock services and return types are:

| Service | Input | Return data type | Current behavior |
|---|---|---|---|
| `getAnalytics(range)` | `RangeKey` | `AnalyticsSummary` | Generated series; numeric aggregates are demo display values only. |
| `getMarketGroups()` | none | `MarketGroup[]` | Fixed illustrative rates; `meta.isMock` is true. |
| `listPayments()` | none | `Payment[]` | Demo fixture list plus browser-memory records created in this tab session. |
| `listBeneficiaries()` | none | `Beneficiary[]` | Fictional supplier fixtures. |
| `getIndicativeQuote(amount, destinationCurrency)` | decimal-string USD amount, `CurrencyCode` | `IndicativeQuote` | Demo formula, decimal-string amounts, string rate, 1% illustrative fee assumption. |
| `createDemoPayment({ amount, beneficiaryId, destinationCurrency })` | decimal-string USD amount and IDs/currency | `Payment` | Adds an in-memory `created` instruction; resets on reload. |

The frontend `Payment` model uses `source` and `destination` `Money` objects plus separate `onchainStatus`, `payoutStatus`, and `transactionReference` fields. The proposed HTTP DTO below is the integration contract; an API client adapter must map it to these view models. Decimal strings from a connected backend must remain decimal-safe and must not be converted to floating point for financial decisions. Numeric analytics and market fixtures remain demo-only.

## Shared response envelope

```ts
interface APIResponse<T> {
  data: T;
  meta?: { source: string; updatedAt: string; isMock: boolean; requestId?: string };
  error?: { code: string; message: string; fieldErrors?: Record<string, string> };
}
```

## Indicative FX quote

`POST /api/v1/fx/quotes`

Request:

```json
{
  "amount": "1000.00",
  "destinationCurrency": "INR"
}
```

Response shape (values are illustrative placeholders, not a rate promise):

```json
{
  "data": {
    "sourceAmount": "1000.00",
    "sourceCurrency": "USD",
    "destinationAmount": "<decimal string>",
    "destinationCurrency": "INR",
    "rate": "<decimal string>",
    "estimatedFee": "<decimal string>",
    "disclaimer": "<provider-appropriate quote description>",
    "quoteId": "quote_opaque",
    "source": "<provider identifier>",
    "quotedAt": "<ISO-8601>",
    "expiresAt": "<ISO-8601>"
  },
  "meta": { "source": "<provider>", "updatedAt": "<ISO-8601>", "isMock": false, "requestId": "req_opaque" }
}
```

The frontend form currently selects the destination currency from the supplier profile; its mock preview accepts only amount and destination currency. A connected form must retain the quote ID and expiry for payment creation. The provider's actual response and quote semantics must be verified before mapping. A reference price is not automatically an executable FX quote.

## Create payment instruction

`POST /api/v1/payments` with `Idempotency-Key: <unique key>`.

```json
{
  "amount": "1000.00",
  "destinationCurrency": "INR",
  "beneficiaryId": "beneficiary_opaque",
  "quoteId": "quote_opaque"
}
```

This is the future backend request, not the current demo service behavior: the Phase 1 mock method has no quote ID and keeps the instruction in memory. Before a connected flow submits a real instruction, it must retain the quote ID returned by the quote API; the server must validate its ownership and expiry and bind the payment instruction to it.

Expected response state is `created`; this only records an instruction. It does not submit a transfer or payout.

```json
{
  "data": {
    "id": "payment_opaque",
    "reference": "<opaque display reference>",
    "beneficiaryId": "beneficiary_opaque",
    "beneficiaryName": "<supplier display name>",
    "createdAt": "<ISO-8601>",
    "source": { "amount": "1000.00", "currency": "USD" },
    "destination": { "amount": "<decimal string>", "currency": "INR" },
    "asset": "USDC",
    "network": "<configured test network>",
    "status": "created",
    "onchainStatus": "not_started",
    "payoutStatus": "not_started",
    "transactionReference": null
  },
  "meta": { "requestId": "req_opaque", "isMock": false }
}
```

## Submit instruction (future, testnet only)

`POST /api/v1/payments/{paymentId}/submit` with a separate `Idempotency-Key`.

```json
{ "confirmation": true }
```

The endpoint must revalidate membership, limits, quote validity, beneficiary state, configured test network, and idempotency before submission. The response reports the actual provider state and may contain a transaction reference only if one exists. It must never mark a fiat payout complete merely because a token transfer was submitted or confirmed.

## Read payment status

`GET /api/v1/payments/{paymentId}`

```json
{
  "data": {
    "id": "payment_opaque",
    "reference": "<opaque display reference>",
    "beneficiaryId": "beneficiary_opaque",
    "beneficiaryName": "<supplier display name>",
    "createdAt": "<ISO-8601>",
    "source": { "amount": "1000.00", "currency": "USD" },
    "destination": { "amount": "<decimal string>", "currency": "INR" },
    "asset": "USDC",
    "network": "<configured test network>",
    "status": "onchain_confirmed",
    "onchainStatus": "confirmed",
    "payoutStatus": "not_started",
    "transactionReference": "<provider-returned reference or null>"
  },
  "meta": { "requestId": "req_opaque", "isMock": false }
}
```

## Read-only frontend endpoints

- `GET /api/v1/analytics/summary?range=week|month|quarter|half|year`
- `GET /api/v1/fx/rates?base=USD`
- `GET /api/v1/payments?status=<optional>&from=<ISO>&to=<ISO>`
- `GET /api/v1/payments/{paymentId}`
- `GET /api/v1/beneficiaries`

Analytics should aggregate persisted records with definitions for every metric. Do not infer pending transaction counts or balances from total volume minus simulated settled volume. Include source and freshness; never present fixture timestamps as market observation timestamps.

## State vocabulary

Overall payment: `created`, `submitted`, `onchain_pending`, `onchain_confirmed`, `fiat_payout_pending`, `fiat_payout_completed`, `failed`, `reconciliation_required`.

Each on-chain and payout leg has its own status (`not_started`, `pending`, `confirmed`/`completed`, `failed`, `reconciliation_required`). Backend transitions are authoritative and append-only auditable events. A completed fiat payout requires a verified payout-provider state, not an on-chain state.

## Errors

Use appropriate HTTP codes and stable error codes such as `VALIDATION_ERROR`, `QUOTE_EXPIRED`, `IDEMPOTENCY_CONFLICT`, `FORBIDDEN`, `NOT_FOUND`, and `PROVIDER_UNAVAILABLE`. Never return secrets, raw provider payloads, or sensitive bank details in errors.
