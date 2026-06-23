import type { Meta, StoryObj } from "@storybook/react";
import { DeltaBadge } from "./DeltaBadge.js";

const meta: Meta<typeof DeltaBadge> = {
  title: "Accounting/DeltaBadge",
  component: DeltaBadge,
};
export default meta;

type Story = StoryObj<typeof DeltaBadge>;

export const Percent: Story = {
  args: { percent: 0.054, caption: "vs last month" },
};

export const Money: Story = {
  args: { value: 18250, asMoney: true, caption: "MTD revenue" },
};

export const ValueAndPercent: Story = {
  args: { value: 200, percent: 0.1, asMoney: true },
};

export const CostWentDown: Story = {
  name: "Decrease is good (costs)",
  args: {
    value: -1200,
    asMoney: true,
    polarity: "decrease-good",
    caption: "operating spend",
  },
};

export const Gallery: Story = {
  render: () => (
    <div
      style={{ display: "grid", gap: 12, gridTemplateColumns: "max-content" }}
    >
      <DeltaBadge percent={0.082} caption="revenue" />
      <DeltaBadge percent={-0.034} caption="gross margin" />
      <DeltaBadge value={-1200} asMoney polarity="decrease-good" caption="spend" />
      <DeltaBadge value={3} polarity="decrease-good" caption="new open items" />
      <DeltaBadge value={0} caption="headcount" />
      <DeltaBadge value={5} percent={0.12} polarity="neutral" caption="raw movement" />
    </div>
  ),
};
