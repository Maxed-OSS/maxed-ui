import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeltaBadge } from "./DeltaBadge.js";

describe("<DeltaBadge>", () => {
  it("renders a signed plain-number value with an up arrow when positive", () => {
    render(<DeltaBadge value={12} />);
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/\+12/)).toBeInTheDocument();
  });

  it("renders a signed percent (ratio -> percentage)", () => {
    render(<DeltaBadge percent={0.054} />);
    expect(screen.getByText(/\+5\.4%/)).toBeInTheDocument();
  });

  it("formats a money value with currency and two default fraction digits", () => {
    render(<DeltaBadge value={-1500} asMoney />);
    // Magnitude is formatted as money, the sign is prepended.
    expect(screen.getByText(/-\$1,500\.00/)).toBeInTheDocument();
  });

  it("combines value and percent when both are given", () => {
    render(<DeltaBadge value={200} percent={0.1} />);
    expect(screen.getByText(/\+200 \/ \+10\.0%/)).toBeInTheDocument();
  });

  it("tones a positive change as success under the default polarity", () => {
    const { container } = render(<DeltaBadge value={5} />);
    expect(container.querySelector("[data-tone]")).toHaveAttribute(
      "data-tone",
      "success",
    );
    expect(container.querySelector("[data-direction]")).toHaveAttribute(
      "data-direction",
      "up",
    );
  });

  it("tones a positive change as danger when decrease-good", () => {
    const { container } = render(
      <DeltaBadge value={5} polarity="decrease-good" />,
    );
    expect(container.querySelector("[data-tone]")).toHaveAttribute(
      "data-tone",
      "danger",
    );
  });

  it("tones a negative change as success when decrease-good (cost went down)", () => {
    const { container } = render(
      <DeltaBadge value={-300} asMoney polarity="decrease-good" />,
    );
    expect(container.querySelector("[data-tone]")).toHaveAttribute(
      "data-tone",
      "success",
    );
  });

  it("renders a flat, neutral badge for zero change", () => {
    const { container } = render(<DeltaBadge value={0} />);
    const badge = container.querySelector("[data-tone]");
    expect(badge).toHaveAttribute("data-tone", "neutral");
    expect(badge).toHaveAttribute("data-direction", "flat");
    expect(screen.getByText(/→/)).toBeInTheDocument();
  });

  it("stays neutral regardless of direction when polarity is neutral", () => {
    const { container } = render(<DeltaBadge value={9} polarity="neutral" />);
    expect(container.querySelector("[data-tone]")).toHaveAttribute(
      "data-tone",
      "neutral",
    );
  });

  it("can hide the arrow", () => {
    render(<DeltaBadge value={3} arrow={false} />);
    expect(screen.queryByText(/↑/)).toBeNull();
    expect(screen.getByText(/\+3/)).toBeInTheDocument();
  });

  it("renders a caption alongside the badge", () => {
    render(<DeltaBadge percent={0.02} caption="vs last month" />);
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("uses themeable CSS variables for its colors", () => {
    const { container } = render(<DeltaBadge value={1} />);
    // The colored pill is the first child span of the [data-tone] wrapper; it
    // reads from --mx-* custom properties so consumers can theme it.
    const pill = container.querySelector("[data-tone]")
      ?.firstElementChild as HTMLElement;
    expect(pill.style.backgroundColor).toContain("--mx-tone-success-bg");
    expect(pill.style.color).toContain("--mx-tone-success-fg");
  });

  it("merges caller-supplied style overrides", () => {
    const { container } = render(
      <DeltaBadge value={1} style={{ marginLeft: 4 }} />,
    );
    expect(container.querySelector("[data-tone]")).toHaveStyle({
      marginLeft: "4px",
    });
  });
});
