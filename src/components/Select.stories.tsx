import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectItem } from "./Select.js";

const meta: Meta<typeof Select> = {
  title: "Accounting/Select",
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const RateTier: Story = {
  render: () => {
    const [value, setValue] = useState("standard");
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <Select aria-label="Rate tier" value={value} onChange={setValue}>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="discounted">Discounted</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="friends">Friends &amp; Family</SelectItem>
        </Select>
        <small>
          Selected value: <code>{value}</code>. The trigger shows the label,
          derived from the children.
        </small>
      </div>
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => (
    <Select aria-label="Account" placeholder="Select an account…" defaultValue="">
      <SelectItem value="1000">1000 · Cash</SelectItem>
      <SelectItem value="4000">4000 · Sales</SelectItem>
      <SelectItem value="5000">5000 · COGS</SelectItem>
    </Select>
  ),
};
