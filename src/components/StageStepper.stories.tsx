import type { Meta, StoryObj } from "@storybook/react";
import { StageStepper, type Step } from "./StageStepper.js";

const meta: Meta<typeof StageStepper> = {
  title: "Accounting/StageStepper",
  component: StageStepper,
};
export default meta;

type Story = StoryObj<typeof StageStepper>;

const taxPrep: Step[] = [
  { id: "gathering", label: "Gathering", description: "Collect documents" },
  { id: "in-prep", label: "In prep", description: "Build the return" },
  { id: "review", label: "Review", description: "Second-pair check" },
  { id: "client-review", label: "Client review" },
  { id: "filed", label: "Filed" },
];

export const Horizontal: Story = {
  args: { steps: taxPrep, activeIndex: 2 },
};

export const Vertical: Story = {
  args: { steps: taxPrep, activeIndex: 2, orientation: "vertical" },
};

export const Clickable: Story = {
  args: {
    steps: taxPrep,
    activeIndex: 1,
    onStepClick: (step) => alert(`Go to ${String(step.label)}`),
  },
};
