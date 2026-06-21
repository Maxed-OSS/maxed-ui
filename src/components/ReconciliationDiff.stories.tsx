import type { Meta, StoryObj } from "@storybook/react";
import { ReconciliationDiff } from "./ReconciliationDiff.js";
import { sampleReconciliation } from "../fixtures/sample.js";

const meta: Meta<typeof ReconciliationDiff> = {
  title: "Accounting/ReconciliationDiff",
  component: ReconciliationDiff,
};
export default meta;

type Story = StoryObj<typeof ReconciliationDiff>;

export const Basic: Story = {
  args: { rows: sampleReconciliation },
};

export const OnlyDifferences: Story = {
  args: { rows: sampleReconciliation, onlyDifferences: true },
};

export const Empty: Story = {
  args: { rows: [] },
};
