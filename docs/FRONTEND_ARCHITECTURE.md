# Frontend architecture

## Current boundaries

```text
App Router pages (presentation and interaction)
  ├─ shared components (shell, page headers, notices, status badges)
  ├─ src/services (typed frontend service functions)
  └─ src/mocks (clearly labelled illustrative fixtures)
src/types (shared domain and response types)
```

`src/app` owns routes and page composition. `src/components` holds reusable presentation. `src/services` is the future API client boundary. `src/mocks` contains demo-only fixtures; services mark responses with `meta.isMock` and `meta.source`. Types are separate in `src/types`.

## Route map

| Route | Purpose |
|---|---|
| `/dashboard` | Volume overview and corridor mix |
| `/payments` | Searchable/filterable payment history |
| `/payments/new` | Demo quote preview and in-memory payment instruction; destination currency follows the selected supplier |
| `/payments/[paymentId]` | Payment details and independent settlement legs |
| `/fx-exchange` | Indicative conversion preview |
| `/market-data` | Mock currency pair values |
| `/settlements` | On-chain and payout statuses with attention tab |
| `/suppliers` | Fictional supplier profiles and destination status |
| `/wallets` | Illustrative testnet assets and balances |
| `/analytics` | Generated charts and corridor performance |
| `/settings` | Organization/preferences/security/integration placeholders |

## UI conventions

- Maintain the lime, charcoal, and white design system and responsive layouts.
- Use `PageHeader`, `DemoNotice`, and `StatusBadge` for consistent hierarchy, data provenance, and state naming.
- Keep client components to interactions that need browser state. Keep service code free of rendering concerns.
- Every asynchronous view should expose loading and failure feedback; filterable views should expose an empty state.
- Label generated data as demo data. A runtime fixture-load time describes the page load, never market-data freshness.

## Financial display rules

- `Money` holds an amount string and currency code to avoid making JS floating point an authoritative representation.
- The demo payment form accepts positive USD amounts up to 1,000,000 with at most two decimal places. It clears the preview when amount or supplier changes and derives payout currency from the selected supplier.
- Display values with explicit currency. Provider values must later be parsed into decimal-safe server-side units before calculation.
- `PaymentStatus`, `PaymentRailStatus`, and a payment’s distinct `onchainStatus` and `payoutStatus` separate the overall instruction from its settlement legs.
- No hash should be shown unless returned from a real provider and stored. Demo references use `DEMO-` identifiers.
- On-chain confirmation does not advance the fiat payout state. The UI says so in payment detail and settlement views.

## Mock boundary and next step

`analytics.service.ts`, `fx.service.ts`, and `payments.service.ts` currently return mock data. Their typed interfaces can later call same-origin API routes. Keep mock fixtures in `src/mocks`, and select mock vs connected providers explicitly on the server; do not merge fixture values into a production response without provenance. Do not add provider credentials to client modules or `NEXT_PUBLIC_` variables.

Suggested future organization:

```text
src/app/api/v1/       HTTP route handlers
src/features/         business logic, schemas, repositories, domain types
src/lib/db/           persistence clients and transaction helpers
src/lib/auth/         session and organization authorization
src/integrations/     server-only provider adapters
src/components/       presentation components
src/services/         browser API client only
src/mocks/            prototype fixtures only
```

The installed Next.js 16 docs describe Route Handlers as public endpoints. Validate every request and authorize every resource access in the backend business layer. With Cache Components enabled in `next.config.ts`, keep user-specific and financial data out of shared caches and use the required Node.js runtime.
