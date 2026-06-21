import type { Meta, StoryObj } from "@storybook/react";
import { LedgerTable } from "./LedgerTable.js";
import { StatusPill } from "./StatusPill.js";
import { sampleLedger } from "../fixtures/sample.js";

const meta: Meta<typeof LedgerTable> = {
  title: "Accounting/LedgerTable",
  component: LedgerTable,
};
export default meta;

type Story = StoryObj<typeof LedgerTable>;

export const Basic: Story = {
  args: { entries: sampleLedger },
};

export const WithRunningBalance: Story = {
  args: {
    entries: sampleLedger,
    showRunningBalance: true,
    openingBalance: 1000,
  },
};

export const WithStatus: Story = {
  args: {
    entries: sampleLedger.map((e, i) => ({
      ...e,
      status:
        i % 2 === 0 ? (
          <StatusPill tone="success" dot>
            Reconciled
          </StatusPill>
        ) : (
          <StatusPill tone="warning" dot>
            Unreviewed
          </StatusPill>
        ),
    })),
  },
};

export const Empty: Story = {
  args: { entries: [] },
};
