import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  PeriodPicker,
  formatPeriod,
  formatPeriodLabel,
  type Period,
} from "./PeriodPicker.js";

describe("formatPeriod", () => {
  it("renders a sortable token per granularity", () => {
    expect(formatPeriod({ granularity: "month", year: 2026, month: 3 })).toBe(
      "2026-M03",
    );
    expect(
      formatPeriod({ granularity: "quarter", year: 2026, quarter: 2 }),
    ).toBe("2026-Q2");
    expect(formatPeriod({ granularity: "year", year: 2026 })).toBe("2026");
  });

  it("zero-pads the month", () => {
    expect(formatPeriod({ granularity: "month", year: 2026, month: 1 })).toBe(
      "2026-M01",
    );
  });
});

describe("formatPeriodLabel", () => {
  it("renders a human-friendly label per granularity", () => {
    expect(
      formatPeriodLabel({ granularity: "month", year: 2026, month: 3 }),
    ).toBe("Mar 2026");
    expect(
      formatPeriodLabel({ granularity: "quarter", year: 2026, quarter: 2 }),
    ).toBe("Q2 2026");
    expect(formatPeriodLabel({ granularity: "year", year: 2026 })).toBe(
      "FY 2026",
    );
  });
});

describe("<PeriodPicker>", () => {
  it("shows month and year selectors for a month period", () => {
    const value: Period = { granularity: "month", year: 2026, month: 3 };
    render(<PeriodPicker value={value} onChange={() => {}} />);
    expect(screen.getByLabelText("Month")).toBeInTheDocument();
    expect(screen.getByLabelText("Year")).toBeInTheDocument();
    expect(screen.queryByLabelText("Quarter")).toBeNull();
  });

  it("emits the changed month, preserving the rest of the period", async () => {
    const onChange = vi.fn();
    const value: Period = { granularity: "month", year: 2026, month: 3 };
    render(<PeriodPicker value={value} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText("Month"), "6");
    expect(onChange).toHaveBeenCalledWith({
      granularity: "month",
      year: 2026,
      month: 6,
    });
  });

  it("emits a normalized period when granularity changes", async () => {
    const onChange = vi.fn();
    const value: Period = { granularity: "month", year: 2026, month: 3 };
    render(
      <PeriodPicker
        value={value}
        onChange={onChange}
        granularities={["month", "quarter", "year"]}
      />,
    );
    await userEvent.selectOptions(
      screen.getByLabelText("Period granularity"),
      "quarter",
    );
    expect(onChange).toHaveBeenCalledWith({
      granularity: "quarter",
      year: 2026,
      quarter: 1,
    });
  });

  it("hides the granularity selector when only one is allowed", () => {
    const value: Period = { granularity: "year", year: 2026 };
    render(<PeriodPicker value={value} onChange={() => {}} />);
    expect(screen.queryByLabelText("Period granularity")).toBeNull();
  });
});
