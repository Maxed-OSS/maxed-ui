# @maxed-oss/maxed-ui

[![CI](https://github.com/maxed-oss/maxed-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/maxed-oss/maxed-ui/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

A lightweight TypeScript + React component kit for building accounting and
bookkeeping UIs. It ships the fiddly, presentation-heavy pieces that every
ledger, reconciliation, or billing screen needs and that are tedious to get
right from scratch.

These are **presentation-only** components: they render the data you pass in.
There is no business logic, no double-entry validation, no rounding policy, and
no network or storage. You own your data and your accounting rules; this kit
just makes them look right on screen.

## Why

Accounting UIs have a recurring set of small, easy-to-botch widgets:

- A **register / ledger table** with aligned debit/credit columns, a running
  balance, and column totals.
- A **money input** that shows a formatted value at rest but is forgiving about
  what users type (currency symbols, thousands separators, accounting parens).
- A **reconciliation diff** that lines up "books" against "bank" and flags
  matches, mismatches, and one-sided entries.
- **Status pills** for row states (reconciled, unreviewed, cleared, ...).
- A **Select** whose trigger shows the selected option's *label*, not its raw
  value -- derived automatically from declarative children, so a parallel
  `items` array can never drift out of sync with the options you rendered.

That last one is a genuine, real-world pain point with primitive select
components (Base UI / Radix style): the trigger only knows the raw `value`, so
you end up hand-maintaining a `value -> label` map next to your `<Option>`s.
`<Select>` here derives that map from its `<SelectItem>` children for you.

## Install

```bash
npm install @maxed-oss/maxed-ui
# peer deps if you don't already have them
npm install react react-dom
```

Or install straight from the repository (no registry required):

```bash
npm install github:maxed-oss/maxed-ui
```

Requires React 18+.

## Import map

Everything is exported from the package root. CSS is a separate, optional entry.

| Import path                  | What you get                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `@maxed-oss/maxed-ui`        | All components, helpers, and theme tokens (see the table below)              |
| `@maxed-oss/maxed-ui/styles.css` | Optional theme stylesheet: enables themeable tokens + dark mode          |

### Exported from `@maxed-oss/maxed-ui`

| Export                  | Kind      | Purpose                                                        |
| ----------------------- | --------- | -------------------------------------------------------------- |
| `LedgerTable`           | component | Register/ledger data table with debit/credit + running balance |
| `MoneyInput`            | component | Forgiving money/number input with formatted display            |
| `ReconciliationDiff`    | component | Side-by-side books-vs-bank diff viewer                         |
| `StatusPill`            | component | Compact, tone-coded status label                               |
| `Select`                | component | Select that auto-derives its label map from children          |
| `SelectItem`            | component | Declarative option child of `Select`                          |
| `deriveItems`           | helper    | Build the `value -> label` item list from `SelectItem` children |
| `formatMoney`           | helper    | Format an amount as a currency string                          |
| `formatNumber`          | helper    | Format a plain number (no currency symbol)                     |
| `parseMoney`            | helper    | Parse user-typed money (symbols, grouping, accounting parens)  |
| `tokens`                | object    | The `--mx-*` design tokens consumed by every component         |
| `tonePalette`           | helper    | Resolve the `{bg, fg, dot}` token triple for a status tone     |
| `THEME_ATTR`            | const     | The theme attribute name (`"data-mx-theme"`)                   |
| `LedgerEntry`, `LedgerTableProps`, `MoneyInputProps`, `ReconLine`, `ReconRow`, `ReconciliationDiffProps`, `StatusPillProps`, `StatusTone`, `SelectProps`, `SelectItemProps`, `MoneyFormatOptions` | types | Public TypeScript types |

## Theming & dark mode

Every color the components use is a CSS custom property (`var(--mx-*)`) with a
baked-in light-mode fallback. Two consequences:

1. **Zero setup renders the default light theme.** You don't need to import any
   stylesheet for the components to look right.
2. **Theming is opt-in and tree-shakeable.** The colors live in a standalone
   stylesheet you import only if you want themeable tokens or dark mode. It is
   not bundled into the JS, so projects that don't theme pay nothing for it.

```ts
// Opt into themeable tokens + dark mode:
import "@maxed-oss/maxed-ui/styles.css";
```

With the stylesheet imported, dark mode applies either automatically (via
`prefers-color-scheme`) or explicitly by setting `data-mx-theme` on any
ancestor. The explicit attribute always wins:

```tsx
<div data-mx-theme="dark"> {/* force dark, ignoring the OS setting */}
  <LedgerTable entries={entries} />
</div>
```

You can also override individual tokens yourself without the stylesheet -- just
define the `--mx-*` variables on a container:

```css
.my-scope {
  --mx-tone-success-fg: #0f7b3f;
  --mx-surface: #fbfbfd;
}
```

The full token list is exported as `tokens` for programmatic use.

## Usage

### Ledger table

```tsx
import { LedgerTable, StatusPill } from "@maxed-oss/maxed-ui";

const entries = [
  {
    id: "1",
    date: "2024-03-01",
    reference: "INV-1001",
    description: "Consulting revenue",
    account: "Sales",
    credit: 4200,
    status: <StatusPill tone="success" dot>Reconciled</StatusPill>,
  },
  {
    id: "2",
    date: "2024-03-03",
    reference: "CHK-2042",
    description: "Office rent",
    account: "Rent Expense",
    debit: 1800,
  },
];

<LedgerTable
  entries={entries}
  showRunningBalance
  openingBalance={1000}
/>;
```

### Money input

```tsx
import { MoneyInput } from "@maxed-oss/maxed-ui";

function FeeField() {
  const [amount, setAmount] = useState<number | null>(1234.5);
  return <MoneyInput aria-label="Fee" value={amount} onChange={setAmount} />;
}
// Displays "$1,234.50" at rest; accepts "$1,234.50", "1234.5", "(50.00)" on input.
```

### Select that shows labels, not values

```tsx
import { Select, SelectItem } from "@maxed-oss/maxed-ui";

<Select aria-label="Rate tier" value={tier} onChange={setTier}>
  <SelectItem value="standard">Standard</SelectItem>
  <SelectItem value="discounted">Discounted</SelectItem>
  <SelectItem value="vip">VIP</SelectItem>
</Select>;
// The trigger shows "VIP" when value is "vip" -- no separate items map to maintain.
```

### Reconciliation diff

```tsx
import { ReconciliationDiff } from "@maxed-oss/maxed-ui";

const rows = [
  {
    id: "r1",
    status: "matched",
    left: { id: "b1", date: "2024-03-01", description: "Deposit", amount: 4200 },
    right: { id: "s1", date: "2024-03-01", description: "ACH credit", amount: 4200 },
  },
  {
    id: "r2",
    status: "onlyLeft",
    left: { id: "b2", date: "2024-03-07", description: "Software", amount: -250 },
  },
];

<ReconciliationDiff rows={rows} onlyDifferences />;
```

The caller computes which lines match; `ReconciliationDiff` renders the result.

## Development

```bash
npm install
npm run build          # type-check + bundle to dist/ (incl. styles.css)
npm test               # vitest (jsdom + React Testing Library)
npm run storybook      # interactive component explorer on :6006
npm run build-storybook  # static Storybook build
```

CI (GitHub Actions) runs the type-check and tests on Node 18/20/22 and builds
both the library and Storybook on every push and pull request. See
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

All sample data in the stories and tests is synthetic and fictional.

## License

[Apache-2.0](./LICENSE).
