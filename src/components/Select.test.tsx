import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectItem, deriveItems } from "./Select.js";

describe("deriveItems", () => {
  it("builds a value→label list from <SelectItem> children", () => {
    const items = deriveItems(
      <>
        <SelectItem value="std">Standard</SelectItem>
        <SelectItem value="vip">VIP</SelectItem>
      </>,
    );
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ value: "std", text: "Standard" });
    expect(items[1]).toMatchObject({ value: "vip", text: "VIP" });
  });

  it("falls back to the value when no label text is provided", () => {
    const items = deriveItems(<SelectItem value="only-value" children={undefined} />);
    expect(items[0].text).toBe("only-value");
  });

  it("ignores non-SelectItem children", () => {
    const items = deriveItems(
      <>
        <SelectItem value="a">A</SelectItem>
        <div>not an item</div>
        {null}
      </>,
    );
    expect(items).toHaveLength(1);
    expect(items[0].value).toBe("a");
  });

  it("marks disabled items", () => {
    const items = deriveItems(
      <SelectItem value="x" disabled>
        X
      </SelectItem>,
    );
    expect(items[0].disabled).toBe(true);
  });
});

describe("<Select>", () => {
  it("renders options derived from children and the selected label", () => {
    render(
      <Select aria-label="Rate tier" value="vip" onChange={() => {}}>
        <SelectItem value="std">Standard</SelectItem>
        <SelectItem value="vip">VIP</SelectItem>
      </Select>,
    );
    const select = screen.getByLabelText("Rate tier") as HTMLSelectElement;
    // The trigger shows the *label* for the selected value, not the raw value.
    expect(select.selectedOptions[0].textContent).toBe("VIP");
    expect(select.value).toBe("vip");
  });

  it("emits the chosen value on change", async () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Tier" defaultValue="std" onChange={onChange}>
        <SelectItem value="std">Standard</SelectItem>
        <SelectItem value="vip">VIP</SelectItem>
      </Select>,
    );
    await userEvent.selectOptions(screen.getByLabelText("Tier"), "vip");
    expect(onChange).toHaveBeenCalledWith("vip");
  });
});
