import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { formatMoney, parseMoney } from "../format.js";
import { tokens } from "../theme.js";

export interface MoneyInputProps {
  /** Controlled numeric value (in major units, e.g. dollars). `null` = empty. */
  value?: number | null;
  /** Called with the parsed numeric value (or `null` when cleared). */
  onChange?: (value: number | null) => void;
  /** ISO 4217 currency code for display formatting. Defaults to "USD". */
  currency?: string;
  /** BCP 47 locale for display formatting. */
  locale?: string;
  /** Decimal places to show when formatted. Defaults to 2. */
  fractionDigits?: number;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A numeric/money input that shows a formatted value when blurred and a clean
 * editable value when focused. Tolerant of grouping separators, currency
 * symbols, and accounting parentheses on input.
 *
 * Presentation only: it never rounds for storage or applies financial policy.
 * It hands the caller the parsed number; what that number *means* is the
 * caller's concern.
 */
export function MoneyInput({
  value,
  onChange,
  currency = "USD",
  locale,
  fractionDigits = 2,
  placeholder = "0.00",
  disabled,
  "aria-label": ariaLabel,
  id,
  name,
  className,
  style,
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const lastValueRef = useRef<number | null | undefined>(value);

  // Keep the draft in sync with an externally-changed value while not editing.
  useEffect(() => {
    if (!focused) {
      lastValueRef.current = value;
    }
  }, [value, focused]);

  const display = (() => {
    if (focused) return draft;
    if (value === null || value === undefined) return "";
    return formatMoney(value, { currency, locale, fractionDigits });
  })();

  const handleFocus = useCallback(() => {
    setFocused(true);
    setDraft(
      value === null || value === undefined ? "" : String(value),
    );
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseMoney(draft);
    onChange?.(parsed);
  }, [draft, onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(e.target.value);
    },
    [],
  );

  return (
    <input
      type="text"
      inputMode="decimal"
      id={id}
      name={name}
      aria-label={ariaLabel}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      value={display}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${tokens.borderInput}`,
        background: tokens.surface,
        color: tokens.text,
        fontSize: 14,
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
        minWidth: 120,
        ...style,
      }}
    />
  );
}
