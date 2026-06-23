import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { tokens } from "../theme.js";

/**
 * Props for a single option. Rendered declaratively as a child of <Select>.
 *
 * The whole point of this wrapper: you write the options as JSX children and
 * the Select derives its internal item list (value -> label map) from them.
 * That means the trigger can show the *label* for the selected value without
 * the caller having to pass a parallel `items` array that can drift out of
 * sync with the children. This is a real pain point with primitive selects
 * (Base UI / Radix style) where the trigger only knows the raw `value`.
 */
export interface SelectItemProps {
  /** The stable value submitted/stored when this option is chosen. */
  value: string;
  /** Visible label. Defaults to the value if omitted and children are text. */
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Marker component. It is never rendered directly by the DOM here; `Select`
 * reads its props to build both the native <option> list and the value-to-label
 * map used to display the current selection. Keeping it as a component (rather
 * than a config array) lets callers compose options naturally in JSX.
 */
export function SelectItem(_props: SelectItemProps): ReactElement | null {
  return null;
}

interface DerivedItem {
  value: string;
  label: ReactNode;
  /** Plain-text label used for the native option element. */
  text: string;
  disabled: boolean;
}

export interface SelectProps {
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Accessible label (sets aria-label when no visible label is wired up). */
  "aria-label"?: string;
  id?: string;
  name?: string;
  /** <SelectItem> children. */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function textOf(node: ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * Extract the derived item list from <SelectItem> children. Exported so it can
 * be unit-tested and reused (e.g. by a fancier popover-based trigger).
 */
export function deriveItems(children: ReactNode): DerivedItem[] {
  const items: DerivedItem[] = [];
  const walk = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      // Transparently descend through fragments so callers can group
      // <SelectItem>s in a <>...</> without losing them.
      if (child.type === Fragment) {
        walk((child.props as { children?: ReactNode }).children);
        return;
      }
      if (child.type !== SelectItem) return;
      const props = child.props as SelectItemProps;
      const label = props.children ?? props.value;
      items.push({
        value: props.value,
        label,
        text: textOf(label) || props.value,
        disabled: Boolean(props.disabled),
      });
    });
  };
  walk(children);
  return items;
}

/**
 * A thin Select wrapper that auto-derives its option list from declarative
 * <SelectItem> children. Renders a native <select> for accessibility and zero
 * dependencies; the derived value→label map is what a custom popover trigger
 * would consume to display the selected label instead of a raw value.
 */
export function Select({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  "aria-label": ariaLabel,
  id,
  name,
  children,
  className,
  style,
}: SelectProps) {
  const items = useMemo(() => deriveItems(children), [children]);
  const autoId = useId();
  const selectId = id ?? autoId;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const controlled = value !== undefined;

  return (
    <select
      id={selectId}
      name={name}
      aria-label={ariaLabel}
      disabled={disabled}
      className={className}
      value={controlled ? value : undefined}
      defaultValue={controlled ? undefined : (defaultValue ?? "")}
      onChange={handleChange}
      style={{
        appearance: "none",
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${tokens.borderInput}`,
        background: tokens.surface,
        color: tokens.text,
        fontSize: 14,
        minWidth: 180,
        ...style,
      }}
    >
      {placeholder !== undefined && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {items.map((item) => (
        <option key={item.value} value={item.value} disabled={item.disabled}>
          {item.text}
        </option>
      ))}
    </select>
  );
}
