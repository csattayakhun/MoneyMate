# MoneyMate

A personal finance tracker for Android, built with Expo and React Native.

Log income and expenses across multiple wallets, keep an eye on a daily spending
limit, and review where the money went — by category and by day. It was written
as a coursework project, but structured the way I'd structure a small production
app: a typed domain model, one source of truth for state, and a design system
driven by tokens rather than scattered inline styles.

## Features

- **Multiple wallets** — cash, bank, savings; view each on its own or all combined.
- **Add / edit / delete transactions** with category, wallet, and inline validation.
- **Daily spending limit** with a colour-coded bar: on track (green), near the
  limit (amber), over (red). The limit is configurable and persisted.
- **Category breakdown** rendered as an SVG donut chart.
- **Monthly calendar** with per-day income/expense markers; tap a day to see it.
- **Statistics** — the month's largest categories, ranked.
- **Offline-first** — everything persists locally with AsyncStorage; no backend.
- Thai UI, Thai Buddhist-calendar dates, and Baht formatting throughout.

## Tech stack

| Area | Choice |
|------|--------|
| Runtime | Expo SDK 57, React Native 0.86, TypeScript (strict) |
| Navigation | expo-router (file-based: bottom tabs + a modal route) |
| UI kit | react-native-paper |
| Charts / graphics | react-native-svg |
| Animation | react-native-reanimated |
| Persistence | @react-native-async-storage/async-storage |
| Type | Prompt (Google Fonts) |

## Architecture

All state lives in a single `MoneyContext` (React Context + hooks). Screens never
read or write storage directly — they consume derived values (`totals`,
`todayExpense`, `visibleTransactions`) and dispatch intent (`addTransaction`,
`updateTransaction`, `setDailyLimit`, …). Persistence is a side effect of state
changes, gated behind a `hydrated` flag so the seed data can't overwrite a user's
saved data on first paint.

The look of the app is token-driven. Colours, spacing, radius, elevation and the
`fontWeight → Prompt family` mapping all live in `src/styles/theme.ts`, so
re-theming the entire app is a one-file change — that's how the move from the
original purple palette to the current warm/pastel one was done.

```
src/
├─ app/                 # expo-router routes
│  ├─ _layout.tsx       # providers + root stack (tabs + add modal)
│  ├─ add.tsx           # add / edit a transaction (modal)
│  └─ (tabs)/           # home, calendar, stats, settings
├─ components/          # reusable UI (DonutChart, TransactionItem, DailyLimitBar, …)
├─ context/             # MoneyContext — the single source of truth
├─ constants/           # categories, wallets, seed transactions
├─ styles/              # design tokens
├─ types/               # domain model (Transaction, Wallet, Category)
└─ utils/               # formatters + id generator
```

## Getting started

Prerequisites: Node 18+, an Android emulator or a device running Expo Go.

```bash
npm install
npx expo start
```

Press `a` to launch on Android, or scan the QR code with Expo Go.

### A note on native-module versions

This project pins `react-native-reanimated@4.5.0` and
`react-native-worklets@0.10.0` against Expo SDK 57. Those versions have to match
the native modules baked into the installed Expo Go build (57.0.2) — a newer
patch such as reanimated 4.5.1 crashes on launch with a `libworklets` SIGSEGV.

Two things follow from that: don't run `expo install --fix` (it bumps the pins),
and answer **no** when `expo start` offers to install a newer Expo Go.

## Known limitations

- Amounts are stored and shown as whole Baht (decimals are rounded on save).
- Home and Statistics label the current month but aggregate all stored
  transactions; the dataset is single-month so far, so month filtering is a
  planned follow-up rather than a bug.
- No automated tests yet. The pure logic — formatters, balance/limit math — is
  the obvious first thing to cover.

## Author

Chirayut Sattayakhun
