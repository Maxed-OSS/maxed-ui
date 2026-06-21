import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
  ReconciliationDiff,
  type ReconRow,
} from "./ReconciliationDiff.js";

const rows: ReconRow[] = [
  {
    id: "r1",
    status: "matched",
    left: { id: "b1", date: "2024-03-01", description: "Deposit", amount: 4200 },
    right: { id: "s1", date: "2024-03-01", description: "ACH credit", amount: 4200 },
  },
  {
    id: "r2",
    status: "mismatched",
    left: { id: "b2", date: "2024-03-03", description: "Rent check", amount: -1800 },
    right: { id: "s2", date: "2024-03-04", description: "Cleared 2042", amount: -1810 },
  },
  {
    id: "r3",
    status: "onlyLeft",
    left: { id: "b3", date: "2024-03-07", description: "Software", amount: -250 },
  },
  {
    id: "r4",
    status: "onlyRight",
    right: { id: "s4", date: "2024-03-09", description: "Bank fee", amount: -12 },
  },
];

describe("<ReconciliationDiff>", () => {
  it("renders both sides of a matched row", () => {
    render(<ReconciliationDiff rows={[rows[0]]} showSummary={false} />);
    expect(screen.getByText("Deposit")).toBeInTheDocument();
    expect(screen.getByText("ACH credit")).toBeInTheDocument();
  });

  it("labels each row with its status", () => {
    render(<ReconciliationDiff rows={rows} showSummary={false} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Matched")).toBeInTheDocument();
    expect(within(table).getByText("Mismatch")).toBeInTheDocument();
    expect(within(table).getByText("Books only")).toBeInTheDocument();
    expect(within(table).getByText("Bank only")).toBeInTheDocument();
  });

  it("renders a placeholder for the missing side of a one-sided row", () => {
    render(<ReconciliationDiff rows={[rows[2]]} showSummary={false} />);
    // onlyLeft: left description present, right side rendered as em-dash placeholders.
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
  });

  it("formats negative amounts in accounting style", () => {
    render(<ReconciliationDiff rows={[rows[3]]} showSummary={false} />);
    expect(screen.getByText("($12.00)")).toBeInTheDocument();
  });

  it("hides matched rows when onlyDifferences is set", () => {
    render(<ReconciliationDiff rows={rows} onlyDifferences showSummary={false} />);
    // The matched row's lines disappear; the differing ones remain.
    expect(screen.queryByText("Deposit")).not.toBeInTheDocument();
    expect(screen.getByText("Rent check")).toBeInTheDocument();
    expect(screen.getByText("Software")).toBeInTheDocument();
  });

  it("shows a summary bar that counts every row by status", () => {
    render(<ReconciliationDiff rows={rows} />);
    // Summary pills read like "Matched: 1". Each status appears once here.
    expect(screen.getByText(/Matched:\s*1/)).toBeInTheDocument();
    expect(screen.getByText(/Mismatch:\s*1/)).toBeInTheDocument();
    expect(screen.getByText(/Books only:\s*1/)).toBeInTheDocument();
    expect(screen.getByText(/Bank only:\s*1/)).toBeInTheDocument();
  });

  it("can hide the summary bar", () => {
    render(<ReconciliationDiff rows={rows} showSummary={false} />);
    expect(screen.queryByText(/Matched:\s*1/)).not.toBeInTheDocument();
  });

  it("uses custom column labels", () => {
    render(
      <ReconciliationDiff
        rows={[rows[0]]}
        leftLabel="Ledger"
        rightLabel="Statement"
        showSummary={false}
      />,
    );
    expect(
      screen.getByRole("columnheader", { name: "Ledger" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Statement" }),
    ).toBeInTheDocument();
  });

  it("shows the empty message when there is nothing to render", () => {
    render(
      <ReconciliationDiff
        rows={[]}
        emptyMessage="All reconciled."
        showSummary={false}
      />,
    );
    expect(screen.getByText("All reconciled.")).toBeInTheDocument();
  });
});
