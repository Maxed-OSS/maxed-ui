# @maxed-oss/maxed-ui

[![CI](https://github.com/maxed-oss/maxed-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/maxed-oss/maxed-ui/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

A lightweight TypeScript + React component kit for building accounting and
bookkeeping UIs. It ships the fiddly, presentation-heavy pieces that every
ledger, reconciliation, or billing screen needs and that are tedious to get
right from scratch.

These components render the data you pass in with consistent layout, formatting,
and interaction patterns for accounting screens.

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
- A **stage stepper** for ordered workflows (engagement progress, a monthly
  close, a tax-prep stage model) with done / current / upcoming states.
- A **fiscal-period picker** that scopes a report or filing to a month,
  quarter, or year and round-trips to a stable token and a readable label.
- A **summary card** of labeled figures for report headers and dashboard tiles,
  with currency formatting and tone-coded values built in.

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
| `StageStepper`          | component | Ordered workflow stepper (done / current / upcoming)          |
| `PeriodPicker`          | component | Fiscal-period selector (month / quarter / year)              |
| `SummaryCard`           | component | Card of labeled figures for headers and dashboard tiles       |
| `deriveItems`           | helper    | Build the `value -> label` item list from `SelectItem` children |
| `formatMoney`           | helper    | Format an amount as a currency string                          |
| `formatNumber`          | helper    | Format a plain number (no currency symbol)                     |
| `parseMoney`            | helper    | Parse user-typed money (symbols, grouping, accounting parens)  |
| `formatPeriod`          | helper    | Render a `Period` as a stable, sortable token (e.g. `2026-Q2`) |
| `formatPeriodLabel`     | helper    | Render a `Period` as a readable label (e.g. `Q2 2026`)        |
| `tokens`                | object    | The `--mx-*` design tokens consumed by every component         |
| `tonePalette`           | helper    | Resolve the `{bg, fg, dot}` token triple for a status tone     |
| `THEME_ATTR`            | const     | The theme attribute name (`"data-mx-theme"`)                   |
| `LedgerEntry`, `LedgerTableProps`, `MoneyInputProps`, `ReconLine`, `ReconRow`, `ReconciliationDiffProps`, `StatusPillProps`, `StatusTone`, `SelectProps`, `SelectItemProps`, `MoneyFormatOptions`, `Step`, `StepState`, `StageStepperProps`, `Period`, `PeriodGranularity`, `PeriodPickerProps`, `SummaryItem`, `SummaryCardProps` | types | Public TypeScript types |

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

### Stage stepper

```tsx
import { StageStepper } from "@maxed-oss/maxed-ui";

const steps = [
  { id: "gathering", label: "Gathering", description: "Collect documents" },
  { id: "in-prep", label: "In prep" },
  { id: "review", label: "Review" },
  { id: "filed", label: "Filed" },
];

<StageStepper steps={steps} activeIndex={2} aria-label="Tax prep stage" />;
// Steps before the active index render as done, the active one as current,
// and the rest as upcoming. Pass onStepClick to make the steps navigable.
```

### Fiscal-period picker

```tsx
import {
  PeriodPicker,
  formatPeriod,
  formatPeriodLabel,
} from "@maxed-oss/maxed-ui";

const [period, setPeriod] = useState({ granularity: "month", year: 2026, month: 6 });

<PeriodPicker
  value={period}
  onChange={setPeriod}
  granularities={["month", "quarter", "year"]}
/>;

formatPeriod(period);      // "2026-M06"  (stable, sortable token)
formatPeriodLabel(period); // "Jun 2026"  (readable label)
```

### Summary card

```tsx
import { SummaryCard } from "@maxed-oss/maxed-ui";

<SummaryCard
  title="Receivables"
  items={[
    { id: "ar", label: "Outstanding", amount: 42850 },
    { id: "overdue", label: "Overdue", amount: -7600, tone: "danger", hint: "5 invoices" },
    { id: "open", label: "Open invoices", value: "18" },
  ]}
/>;
// Numeric `amount`s format as currency (negatives in accounting style);
// pass a pre-rendered `value` for anything that is not a plain amount.
```

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
