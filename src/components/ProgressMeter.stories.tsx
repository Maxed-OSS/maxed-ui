import type { Meta, StoryObj } from "@storybook/react";
import { ProgressMeter } from "./ProgressMeter.js";

const meta: Meta<typeof ProgressMeter> = {
  title: "Accounting/ProgressMeter",
  component: ProgressMeter,
};
export default meta;

type Story = StoryObj<typeof ProgressMeter>;

export const CloseChecklist: Story = {
  args: {
    label: "Close checklist",
    value: 7,
    total: 12,
  },
};

export const PercentCaption: Story = {
  args: {
    label: "Request list received",
    value: 3,
    total: 4,
    caption: "percent",
  },
};

export const Complete: Story = {
  args: {
    label: "Reconciliation",
    value: 18,
    total: 18,
  },
};

export const PinnedTone: Story = {
  args: {
    label: "In progress",
    value: 2,
    total: 10,
    tone: "info",
    height: 12,
  },
};

export const Stack: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 320 }}>
      <ProgressMeter label="Engagement A" value={12} total={12} />
      <ProgressMeter label="Engagement B" value={6} total={10} />
      <ProgressMeter label="Engagement C" value={1} total={9} caption="percent" />
      <ProgressMeter label="Engagement D" value={0} total={5} />
    </div>
  ),
};
