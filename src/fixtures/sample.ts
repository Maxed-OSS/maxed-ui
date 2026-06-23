/**
 * Synthetic, fictional sample data for stories and tests.
 *
 * Everything here is made up for demonstration. No real businesses, accounts,
 * or financial records are represented.
 */
import type { LedgerEntry } from "../components/LedgerTable.js";
import type { ReconRow } from "../components/ReconciliationDiff.js";

export const sampleLedger: LedgerEntry[] = [
  {
    id: "l1",
    date: "2024-03-01",
    reference: "INV-1001",
    description: "Consulting revenue, Acme Widgets Co.",
    account: "Sales",
    credit: 4200,
  },
  {
    id: "l2",
    date: "2024-03-03",
    reference: "CHK-2042",
    description: "Office rent",
    account: "Rent Expense",
    debit: 1800,
  },
  {
    id: "l3",
    date: "2024-03-07",
    reference: "ACH-5530",
    description: "Software subscriptions",
    account: "Software Expense",
    debit: 249.99,
  },
  {
    id: "l4",
    date: "2024-03-12",
    reference: "INV-1002",
    description: "Retainer, Northwind Traders",
    account: "Sales",
    credit: 3000,
  },
  {
    id: "l5",
    date: "2024-03-15",
    reference: "CHK-2043",
    description: "Payroll",
    account: "Wages Expense",
    debit: 5120.4,
  },
];

export const sampleReconciliation: ReconRow[] = [
  {
    id: "r1",
    status: "matched",
    left: { id: "b1", date: "2024-03-01", description: "Deposit INV-1001", amount: 4200 },
    right: { id: "s1", date: "2024-03-01", description: "ACH credit", amount: 4200 },
  },
  {
    id: "r2",
    status: "mismatched",
    left: { id: "b2", date: "2024-03-03", description: "Rent check", amount: -1800 },
    right: { id: "s2", date: "2024-03-04", description: "Cleared check 2042", amount: -1810 },
  },
  {
    id: "r3",
    status: "onlyLeft",
    left: { id: "b3", date: "2024-03-07", description: "Software subscriptions", amount: -249.99 },
  },
  {
    id: "r4",
    status: "onlyRight",
    right: { id: "s4", date: "2024-03-09", description: "Bank service fee", amount: -12 },
  },
];
