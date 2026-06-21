import type { Meta, StoryObj } from "@storybook/react";
import { StatusPill, type StatusTone } from "./StatusPill.js";

const meta: Meta<typeof StatusPill> = {
  title: "Accounting/StatusPill",
  component: StatusPill,
};
export default meta;

type Story = StoryObj<typeof StatusPill>;

export const Single: Story = {
  args: { tone: "success", children: "Reconciled", dot: true },
};

const tones: StatusTone[] = ["neutral", "info", "success", "warning", "danger"];

export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tones.map((tone) => (
        <StatusPill key={tone} tone={tone} dot>
          {tone}
        </StatusPill>
      ))}
    </div>
  ),
};
