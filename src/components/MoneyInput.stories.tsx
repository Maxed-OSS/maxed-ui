import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MoneyInput } from "./MoneyInput.js";

const meta: Meta<typeof MoneyInput> = {
  title: "Accounting/MoneyInput",
  component: MoneyInput,
};
export default meta;

type Story = StoryObj<typeof MoneyInput>;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(1234.5);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <MoneyInput aria-label="Amount" value={value} onChange={setValue} />
        <small>
          Parsed value: <code>{value === null ? "null" : value}</code>
        </small>
      </div>
    );
  },
};

export const Euro: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(980.25);
    return (
      <MoneyInput
        aria-label="Amount (EUR)"
        currency="EUR"
        locale="de-DE"
        value={value}
        onChange={setValue}
      />
    );
  },
};
