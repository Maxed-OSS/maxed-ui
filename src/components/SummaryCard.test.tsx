import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCard, type SummaryItem } from "./SummaryCard.js";

const items: SummaryItem[] = [
  { id: "ar", label: "Accounts receivable", amount: 12500 },
  { id: "overdue", label: "Overdue", amount: -3200, tone: "danger" },
  { id: "count", label: "Open invoices", value: "14" },
];

describe("<SummaryCard>", () => {
  it("renders a title when provided", () => {
    render(<SummaryCard title="Receivables" items={items} />);
    expect(screen.getByText("Receivables")).toBeInTheDocument();
  });

  it("formats a numeric amount as currency", () => {
    render(<SummaryCard items={[items[0]]} />);
    expect(screen.getByText("$12,500.00")).toBeInTheDocument();
  });

  it("renders a negative amount in accounting style", () => {
    render(<SummaryCard items={[items[1]]} />);
    expect(screen.getByText("($3,200.00)")).toBeInTheDocument();
  });

  it("renders a pre-rendered value as-is (no currency formatting)", () => {
    render(<SummaryCard items={[items[2]]} />);
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it("applies a tone color to the value", () => {
    render(<SummaryCard items={[items[1]]} />);
    const value = screen.getByText("($3,200.00)");
    expect(value.style.color).toContain("--mx-tone-danger-fg");
  });

  it("renders a hint line when provided", () => {
    render(
      <SummaryCard
        items={[{ id: "x", label: "Net income", amount: 4200, hint: "up 8% vs prior" }]}
      />,
    );
    expect(screen.getByText("up 8% vs prior")).toBeInTheDocument();
  });

  it("respects an explicit currency code", () => {
    render(
      <SummaryCard
        currency="EUR"
        locale="en-US"
        items={[{ id: "e", label: "Total", amount: 1000 }]}
      />,
    );
    expect(screen.getByText("€1,000.00")).toBeInTheDocument();
  });

  it("uses a labeled definition list for the figures", () => {
    const { container } = render(<SummaryCard items={items} />);
    expect(container.querySelector("dl")).toBeInTheDocument();
    expect(container.querySelectorAll("dt")).toHaveLength(items.length);
    expect(container.querySelectorAll("dd")).toHaveLength(items.length);
  });
});
