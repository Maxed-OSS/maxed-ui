import type { Meta, StoryObj } from "@storybook/react";
import { SummaryCard } from "./SummaryCard.js";

const meta: Meta<typeof SummaryCard> = {
  title: "Accounting/SummaryCard",
  component: SummaryCard,
};
export default meta;

type Story = StoryObj<typeof SummaryCard>;

export const Receivables: Story = {
  args: {
    title: "Receivables",
    items: [
      { id: "ar", label: "Outstanding", amount: 42850 },
      { id: "overdue", label: "Overdue", amount: -7600, tone: "danger", hint: "5 invoices" },
      { id: "paid", label: "Paid this month", amount: 31200, tone: "success" },
      { id: "open", label: "Open invoices", value: "18" },
    ],
  },
};

export const TwoColumn: Story = {
  args: {
    title: "Close summary",
    columns: 2,
    items: [
      { id: "net", label: "Net income", amount: 18400, hint: "up 8% vs prior period" },
      { id: "cash", label: "Cash on hand", amount: 96250 },
      { id: "items", label: "Open items", value: "3", tone: "warning" },
      { id: "status", label: "Status", value: "In review" },
    ],
  },
};
