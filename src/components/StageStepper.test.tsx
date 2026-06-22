import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StageStepper, type Step } from "./StageStepper.js";

const steps: Step[] = [
  { id: "intake", label: "Intake" },
  { id: "prep", label: "Prep" },
  { id: "review", label: "Review" },
  { id: "deliver", label: "Deliver" },
];

describe("<StageStepper>", () => {
  it("renders each step's label", () => {
    render(<StageStepper steps={steps} activeIndex={1} />);
    for (const s of steps) {
      expect(screen.getByText(s.label as string)).toBeInTheDocument();
    }
  });

  it("derives state from activeIndex (before=done, at=current, after=upcoming)", () => {
    const { container } = render(<StageStepper steps={steps} activeIndex={1} />);
    const items = container.querySelectorAll("li");
    expect(items[0]).toHaveAttribute("data-state", "done");
    expect(items[1]).toHaveAttribute("data-state", "current");
    expect(items[2]).toHaveAttribute("data-state", "upcoming");
    expect(items[3]).toHaveAttribute("data-state", "upcoming");
  });

  it("marks the current step with aria-current", () => {
    render(<StageStepper steps={steps} activeIndex={2} />);
    const current = screen.getByText("Review").closest("[aria-current]");
    expect(current).toHaveAttribute("aria-current", "step");
  });

  it("lets a step override the derived state", () => {
    const { container } = render(
      <StageStepper
        steps={[{ id: "a", label: "A", state: "done" }, { id: "b", label: "B" }]}
        activeIndex={0}
      />,
    );
    // Step 0 would normally be "current" at activeIndex 0, but it sets "done".
    expect(container.querySelectorAll("li")[0]).toHaveAttribute(
      "data-state",
      "done",
    );
  });

  it("renders a description when provided", () => {
    render(
      <StageStepper
        steps={[{ id: "x", label: "Prep", description: "Gather documents" }]}
      />,
    );
    expect(screen.getByText("Gather documents")).toBeInTheDocument();
  });

  it("invokes onStepClick with the step and index", async () => {
    const onStepClick = vi.fn();
    render(<StageStepper steps={steps} activeIndex={0} onStepClick={onStepClick} />);
    await userEvent.click(screen.getByText("Review"));
    expect(onStepClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "review" }),
      2,
    );
  });

  it("renders steps as buttons only when clickable", () => {
    const { rerender } = render(<StageStepper steps={steps} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    rerender(<StageStepper steps={steps} onStepClick={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(steps.length);
  });
});
