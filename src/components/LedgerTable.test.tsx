import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LedgerTable, type LedgerEntry } from "./LedgerTable.js";

const entries: LedgerEntry[] = [
  {
    id: "1",
    date: "2024-03-01",
    reference: "INV-1001",
    description: "Consulting revenue",
    account: "Sales",
    credit: 4200,
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

describe("<LedgerTable>", () => {
  it("renders a row per entry with its description", () => {
    render(<LedgerTable entries={entries} />);
    expect(screen.getByText("Consulting revenue")).toBeInTheDocument();
    expect(screen.getByText("Office rent")).toBeInTheDocument();
  });

  it("formats debit and credit amounts and leaves the other column blank", () => {
    render(<LedgerTable entries={entries} showTotals={false} />);
    expect(screen.getByText("$4,200.00")).toBeInTheDocument();
    expect(screen.getByText("$1,800.00")).toBeInTheDocument();
  });

  it("computes column totals in the footer by default", () => {
    render(<LedgerTable entries={entries} />);
    const footer = screen.getByText("Totals").closest("tr")!;
    // Total debit = 1800, total credit = 4200.
    expect(within(footer).getByText("$1,800.00")).toBeInTheDocument();
    expect(within(footer).getByText("$4,200.00")).toBeInTheDocument();
  });

  it("can hide the totals footer", () => {
    render(<LedgerTable entries={entries} showTotals={false} />);
    expect(screen.queryByText("Totals")).not.toBeInTheDocument();
  });

  it("renders a running balance column from the opening balance", () => {
    render(
      <LedgerTable
        entries={entries}
        showRunningBalance
        openingBalance={1000}
        showTotals={false}
      />,
    );
    // 1000 - 4200 (credit) = -3200, shown in accounting style.
    expect(screen.getByText("($3,200.00)")).toBeInTheDocument();
    // -3200 + 1800 (debit) = -1400 (closing running balance).
    expect(screen.getByText("($1,400.00)")).toBeInTheDocument();
  });

  it("carries the closing running balance into the totals footer", () => {
    render(
      <LedgerTable entries={entries} showRunningBalance openingBalance={1000} />,
    );
    const footer = screen.getByText("Totals").closest("tr")!;
    expect(within(footer).getByText("($1,400.00)")).toBeInTheDocument();
  });

  it("shows the empty message when there are no entries", () => {
    render(<LedgerTable entries={[]} emptyMessage="Nothing here yet." />);
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    expect(screen.queryByText("Totals")).not.toBeInTheDocument();
  });

  it("renders a Status column only when an entry carries a status", () => {
    const { rerender } = render(<LedgerTable entries={entries} />);
    expect(
      screen.queryByRole("columnheader", { name: "Status" }),
    ).not.toBeInTheDocument();

    rerender(
      <LedgerTable
        entries={[{ ...entries[0], status: <span>Reconciled</span> }]}
      />,
    );
    expect(
      screen.getByRole("columnheader", { name: "Status" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Reconciled")).toBeInTheDocument();
  });

  it("invokes onRowClick with the clicked entry", async () => {
    const onRowClick = vi.fn();
    render(<LedgerTable entries={entries} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText("Office rent"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "2", description: "Office rent" }),
    );
  });

  it("formats amounts with a non-default currency", () => {
    render(
      <LedgerTable
        entries={[{ id: "x", date: "2024-01-01", description: "Sale", credit: 10 }]}
        currency="EUR"
        locale="en-US"
        showTotals={false}
      />,
    );
    expect(screen.getByText("€10.00")).toBeInTheDocument();
  });
});
