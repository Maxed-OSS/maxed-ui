import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusPill } from "./StatusPill.js";

describe("<StatusPill>", () => {
  it("renders its children as the label", () => {
    render(<StatusPill>Reconciled</StatusPill>);
    expect(screen.getByText("Reconciled")).toBeInTheDocument();
  });

  it("exposes the tone via a data attribute (defaulting to neutral)", () => {
    render(<StatusPill>Draft</StatusPill>);
    expect(screen.getByText("Draft")).toHaveAttribute("data-tone", "neutral");
  });

  it("reflects an explicit tone", () => {
    render(<StatusPill tone="success">Cleared</StatusPill>);
    expect(screen.getByText("Cleared")).toHaveAttribute("data-tone", "success");
  });

  it("renders an aria-hidden dot only when requested", () => {
    const { rerender, container } = render(
      <StatusPill>No dot</StatusPill>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();

    rerender(
      <StatusPill dot tone="warning">
        With dot
      </StatusPill>,
    );
    expect(
      container.querySelector('[aria-hidden="true"]'),
    ).toBeInTheDocument();
  });

  it("passes a title through for tooltips", () => {
    render(
      <StatusPill title="Bank cleared on 03/04">Cleared</StatusPill>,
    );
    expect(screen.getByText("Cleared")).toHaveAttribute(
      "title",
      "Bank cleared on 03/04",
    );
  });

  it("uses themeable CSS variables for its colors", () => {
    render(<StatusPill tone="danger">Unmatched</StatusPill>);
    const pill = screen.getByText("Unmatched");
    // The component reads from --mx-* custom properties so consumers can theme
    // it (incl. dark mode) without prop drilling.
    expect(pill.style.backgroundColor).toContain("--mx-tone-danger-bg");
    expect(pill.style.color).toContain("--mx-tone-danger-fg");
  });

  it("merges caller-supplied style overrides", () => {
    render(
      <StatusPill style={{ marginLeft: 4 }}>Spaced</StatusPill>,
    );
    expect(screen.getByText("Spaced")).toHaveStyle({ marginLeft: "4px" });
  });
});
