# maxed-ui

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
  value — derived automatically from declarative children, so a parallel
  `items` array can never drift out of sync with the options you rendered.

That last one is a genuine, real-world pain point with primitive select
components (Base UI / Radix style): the trigger only knows the raw `value`, so
you end up hand-maintaining a `value -> label` map next to your `<Option>`s.
`<Select>` here derives that map from its `<SelectItem>` children for you.

## Install

```bash
npm install maxed-ui
# peer deps if you don't already have them
npm install react react-dom
```

Requires React 18+.

## Components

| Component            | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `LedgerTable`        | Register/ledger data table with debit/credit + running balance |
| `MoneyInput`         | Forgiving money/number input with formatted display            |
| `ReconciliationDiff` | Side-by-side books-vs-bank diff viewer                         |
| `StatusPill`         | Compact, tone-coded status label                               |
| `Select` / `SelectItem` | Select that auto-derives its label map from children       |

Helpers: `formatMoney`, `formatNumber`, `parseMoney`.

## Usage

### Ledger table

```tsx
import { LedgerTable, StatusPill } from "maxed-ui";

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
import { MoneyInput } from "maxed-ui";

function FeeField() {
  const [amount, setAmount] = useState<number | null>(1234.5);
  return <MoneyInput aria-label="Fee" value={amount} onChange={setAmount} />;
}
// Displays "$1,234.50" at rest; accepts "$1,234.50", "1234.5", "(50.00)" on input.
```

### Select that shows labels, not values

```tsx
import { Select, SelectItem } from "maxed-ui";

<Select aria-label="Rate tier" value={tier} onChange={setTier}>
  <SelectItem value="standard">Standard</SelectItem>
  <SelectItem value="discounted">Discounted</SelectItem>
  <SelectItem value="vip">VIP</SelectItem>
</Select>;
// The trigger shows "VIP" when value is "vip" — no separate items map to maintain.
```

### Reconciliation diff

```tsx
import { ReconciliationDiff } from "maxed-ui";

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
npm run build        # type-check + bundle to dist/
npm test             # vitest (jsdom + React Testing Library)
npm run storybook    # interactive component explorer on :6006
```

All sample data in the stories and tests is synthetic and fictional.

## License

[Apache-2.0](./LICENSE).
