# maxed-ui for agents

`@maxed-oss/maxed-ui` is a TypeScript + React component kit for accounting and
bookkeeping screens. It is presentation-only: components render the data you
pass in, hold no business logic, and make no network calls. There is no CLI and
no JSON pipeline; the machine interface is the typed component API below.

## How agents use it

Generate or edit UI code that imports from the package root. All exports are
typed, so `tsc` is the correctness check for anything an agent writes.

```tsx
import {
  LedgerTable, MoneyInput, ReconciliationDiff, StatusPill,
  Select, SelectItem, StageStepper, PeriodPicker, SummaryCard,
  ProgressMeter, DeltaBadge,
  formatMoney, parseMoney, formatPeriod, formatPeriodLabel,
} from "@maxed-oss/maxed-ui";
import "@maxed-oss/maxed-ui/styles.css"; // optional: theme tokens + dark mode
```

Key facts an agent should not guess wrong:

- `LedgerTable` takes `entries: LedgerEntry[]` and renders aligned debit/credit
  columns with a running balance and totals.
- `MoneyInput` accepts forgiving user input (symbols, grouping, accounting
  parens); `parseMoney` is the same parser as a standalone helper.
- `Select` derives its value-to-label map from `SelectItem` children; never
  maintain a parallel `items` array.
- `PeriodPicker` round-trips a `Period` to a stable token via `formatPeriod`
  (e.g. `2026-Q2`) and a label via `formatPeriodLabel` (e.g. `Q2 2026`).
- `DeltaBadge` tone is driven by a declared `DeltaPolarity` per metric, not by
  the sign alone.
- Theming: every color is a `--mx-*` CSS custom property; dark mode via
  `prefers-color-scheme` or `data-mx-theme="dark"` on an ancestor
  (`THEME_ATTR`). No stylesheet import is required for the default light theme.

## Types (canonical)

Public TypeScript types ship with the package: `LedgerEntry`,
`LedgerTableProps`, `MoneyInputProps`, `ReconLine`, `ReconRow`,
`ReconciliationDiffProps`, `StatusPillProps`, `StatusTone`, `SelectProps`,
`SelectItemProps`, `MoneyFormatOptions`, `Step`, `StepState`,
`StageStepperProps`, `Period`, `PeriodGranularity`, `PeriodPickerProps`,
`SummaryItem`, `SummaryCardProps`, `ProgressMeterProps`, `DeltaBadgeProps`,
`DeltaPolarity`.

## Backs the MCP tool

None. [maxed-mcp](https://github.com/maxed-oss/maxed-mcp) fronts the suite's
deterministic data tools; this kit is the render layer for their output (for
example, feeding normalized transactions from statement-normalizer into
`LedgerTable`).

## Build / test

`npm ci`, `npm test` (vitest), `npm run build` (tsc + vite),
`npm run build-storybook` (component demos).
