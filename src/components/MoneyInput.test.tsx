import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoneyInput } from "./MoneyInput.js";
import { parseMoney, formatMoney } from "../format.js";

describe("parseMoney", () => {
  it("parses grouped and symboled input", () => {
    expect(parseMoney("$1,234.50")).toBe(1234.5);
  });

  it("parses accounting-style negatives", () => {
    expect(parseMoney("(50.00)")).toBe(-50);
  });

  it("returns null for empty / non-numeric input", () => {
    expect(parseMoney("")).toBeNull();
    expect(parseMoney("   ")).toBeNull();
    expect(parseMoney("abc")).toBeNull();
  });
});

describe("formatMoney", () => {
  it("formats USD by default", () => {
    expect(formatMoney(1234.5)).toBe("$1,234.50");
  });

  it("supports accounting negatives", () => {
    expect(formatMoney(-50, { accountingNegative: true })).toBe("($50.00)");
  });
});

describe("<MoneyInput>", () => {
  it("shows a formatted value when not focused", () => {
    render(<MoneyInput aria-label="Amount" value={1234.5} onChange={() => {}} />);
    const input = screen.getByLabelText("Amount") as HTMLInputElement;
    expect(input.value).toBe("$1,234.50");
  });

  it("reports the parsed number on blur", async () => {
    const onChange = vi.fn();
    render(<MoneyInput aria-label="Amount" value={null} onChange={onChange} />);
    const input = screen.getByLabelText("Amount");
    await userEvent.click(input);
    await userEvent.type(input, "1,500.25");
    await userEvent.tab();
    expect(onChange).toHaveBeenCalledWith(1500.25);
  });

  it("reports null when cleared", async () => {
    const onChange = vi.fn();
    render(<MoneyInput aria-label="Amount" value={42} onChange={onChange} />);
    const input = screen.getByLabelText("Amount");
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.tab();
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
