# Corridor

Corridor is a prototype cross-border SME payment and settlement interface. It demonstrates how an SME could review currency conversion assumptions, create a payment instruction, and track stablecoin and supplier payout states separately.

## Technology

- Next.js 16 App Router and React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Recharts for charts
- Lucide React available for interface icons

## Local setup

Requirements: Node.js compatible with the installed Next.js version and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`. The current frontend needs no environment variables. Do not add credentials to the browser or commit secret values. Future server-side configuration should use a local ignored `.env.local` and a committed `.env.example` containing placeholders only.

Checks:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit --incremental false
npm.cmd run build
```

## Routes

- `/dashboard` — volume overview and corridors
- `/payments` — payment history, search, date and status filters
- `/payments/new` — indicative demo preview and local demo instruction
- `/payments/[paymentId]` — payment detail with separate on-chain and fiat payout legs
- `/fx-exchange` — indicative conversion preview
- `/market-data` — illustrative currency and stablecoin pairs
- `/settlements` — settlement progress and reconciliation examples
- `/suppliers` — fictional supplier profiles and destination setup states
- `/wallets` — illustrative testnet assets and balances
- `/analytics` — generated volume and corridor charts
- `/settings` — organization, preferences, security, and integration placeholders

## Demo limitations

All payments, balances, FX values, analytics, suppliers, and settlement states are mock fixtures. The conversion calculation and fee assumption are for interface demonstration only. New payment instructions are kept in local in-memory data and disappear on reload. The frontend does not connect to a wallet, move funds, request a real quote, confirm a blockchain transaction, or pay a supplier's bank account. No transaction hashes or bank payout confirmations are fabricated. “On-chain confirmed” and “fiat payout completed” are separate states; an on-chain transfer alone never means fiat payout completion.

## Architecture and future backend integration

Presentation lives in `src/app` and reusable UI in `src/components`; domain types are in `src/types`; frontend service contracts are in `src/services`; fixtures are isolated in `src/mocks`. The service boundary is intended to switch to typed backend API calls without putting provider credentials or financial decisions in browser code. See [Frontend architecture](docs/FRONTEND_ARCHITECTURE.md), [API contracts](docs/API_CONTRACTS.md), and [Backend handoff](docs/BACKEND_HANDOFF.md).

Future work can add authenticated, tenant-scoped API routes and persistence, then verified provider adapters for FX data, stablecoin infrastructure, and (if selected and supported) payout services. No Supabase, Circle, Chainlink, CCIP, or real payment integration is implemented in this phase. Add only server-side secrets using a managed secret store or ignored local environment file; never use `NEXT_PUBLIC_` for secrets. Validate provider capabilities, networks, and eligibility before describing them as supported.
