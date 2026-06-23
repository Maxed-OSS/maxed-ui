import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressMeter } from "./ProgressMeter.js";

describe("<ProgressMeter>", () => {
  it("renders a fraction caption by default", () => {
    render(<ProgressMeter value={7} total={12} label="Close checklist" />);
    expect(screen.getByText("7 / 12")).toBeInTheDocument();
    expect(screen.getByText("Close checklist")).toBeInTheDocument();
  });

  it("renders a percent caption when asked", () => {
    render(<ProgressMeter value={3} total={4} caption="percent" />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("omits the caption when caption is none", () => {
    render(<ProgressMeter value={1} total={2} caption="none" />);
    expect(screen.queryByText("1 / 2")).not.toBeInTheDocument();
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  it("exposes accessible progressbar attributes", () => {
    render(<ProgressMeter value={5} total={10} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "10");
    expect(bar).toHaveAttribute("aria-valuenow", "5");
    expect(bar).toHaveAttribute("aria-valuetext", "50%");
  });

  it("clamps an over-full value to 100% and the total", () => {
    render(<ProgressMeter value={20} total={12} caption="percent" />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "12");
  });

  it("reports 0% and stays empty when total is zero", () => {
    render(<ProgressMeter value={3} total={0} caption="percent" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "0");
  });

  it("grades the auto tone to success at full completion", () => {
    const { container } = render(<ProgressMeter value={4} total={4} />);
    expect(container.querySelector('[data-tone="success"]')).toBeInTheDocument();
  });

  it("grades the auto tone to warning when barely started", () => {
    const { container } = render(<ProgressMeter value={1} total={10} />);
    expect(container.querySelector('[data-tone="warning"]')).toBeInTheDocument();
  });

  it("honors a pinned tone over auto grading", () => {
    const { container } = render(<ProgressMeter value={1} total={10} tone="info" />);
    expect(container.querySelector('[data-tone="info"]')).toBeInTheDocument();
  });
});
