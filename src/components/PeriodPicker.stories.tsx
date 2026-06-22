import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  PeriodPicker,
  formatPeriod,
  formatPeriodLabel,
  type Period,
} from "./PeriodPicker.js";

const meta: Meta<typeof PeriodPicker> = {
  title: "Accounting/PeriodPicker",
  component: PeriodPicker,
};
export default meta;

type Story = StoryObj<typeof PeriodPicker>;

function Demo({ initial }: { initial: Period }) {
  const [value, setValue] = useState<Period>(initial);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <PeriodPicker
        value={value}
        onChange={setValue}
        granularities={["month", "quarter", "year"]}
      />
      <div style={{ fontSize: 13 }}>
        token: <code>{formatPeriod(value)}</code> &nbsp; label:{" "}
        <strong>{formatPeriodLabel(value)}</strong>
      </div>
    </div>
  );
}

export const Month: Story = {
  render: () => <Demo initial={{ granularity: "month", year: 2026, month: 6 }} />,
};

export const Quarter: Story = {
  render: () => <Demo initial={{ granularity: "quarter", year: 2026, quarter: 2 }} />,
};

export const Year: Story = {
  render: () => <Demo initial={{ granularity: "year", year: 2026 }} />,
};
