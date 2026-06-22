import { useCallback, type CSSProperties } from "react";
import { tokens } from "../theme.js";

/** The granularity of an accounting period. */
export type PeriodGranularity = "month" | "quarter" | "year";

/**
 * A normalized accounting period. Presentation shape only.
 *
 * - `month`   -> year + month (1-12)
 * - `quarter` -> year + quarter (1-4)
 * - `year`    -> year only
 */
export interface Period {
  granularity: PeriodGranularity;
  year: number;
  /** Month (1-12) when granularity is "month". */
  month?: number;
  /** Quarter (1-4) when granularity is "quarter". */
  quarter?: number;
}

export interface PeriodPickerProps {
  /** Controlled period value. */
  value: Period;
  /** Called with the next period when the user changes a field. */
  onChange?: (value: Period) => void;
  /**
   * Which granularities the user may pick. When more than one is allowed a
   * granularity selector is shown. Defaults to just the value's granularity.
   */
  granularities?: PeriodGranularity[];
  /** Earliest selectable year. Defaults to value.year - 10. */
  minYear?: number;
  /** Latest selectable year. Defaults to value.year + 1. */
  maxYear?: number;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Render a period as a stable, sortable string token.
 *
 * @example formatPeriod({ granularity: "month", year: 2026, month: 3 }) // "2026-M03"
 * @example formatPeriod({ granularity: "quarter", year: 2026, quarter: 2 }) // "2026-Q2"
 * @example formatPeriod({ granularity: "year", year: 2026 }) // "2026"
 */
export function formatPeriod(period: Period): string {
  switch (period.granularity) {
    case "month":
      return `${period.year}-M${String(period.month ?? 1).padStart(2, "0")}`;
    case "quarter":
      return `${period.year}-Q${period.quarter ?? 1}`;
    case "year":
    default:
      return String(period.year);
  }
}

/**
 * Render a period as a human-friendly label.
 *
 * @example formatPeriodLabel({ granularity: "month", year: 2026, month: 3 }) // "Mar 2026"
 * @example formatPeriodLabel({ granularity: "quarter", year: 2026, quarter: 2 }) // "Q2 2026"
 */
export function formatPeriodLabel(period: Period): string {
  switch (period.granularity) {
    case "month":
      return `${MONTHS[(period.month ?? 1) - 1]} ${period.year}`;
    case "quarter":
      return `Q${period.quarter ?? 1} ${period.year}`;
    case "year":
    default:
      return `FY ${period.year}`;
  }
}

const field: CSSProperties = {
  appearance: "none",
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${tokens.borderInput}`,
  background: tokens.surface,
  color: tokens.text,
  fontSize: 14,
};

/**
 * A fiscal-period selector for accounting screens: pick a month, quarter, or
 * year that scopes a report, a close, or a filing. It emits a normalized
 * `Period` object and ships `formatPeriod` / `formatPeriodLabel` helpers so a
 * period round-trips to a stable token and a readable label.
 *
 * Presentation only: it computes nothing about the period beyond formatting it.
 */
export function PeriodPicker({
  value,
  onChange,
  granularities,
  minYear,
  maxYear,
  disabled,
  "aria-label": ariaLabel,
  className,
  style,
}: PeriodPickerProps) {
  const allowed = granularities ?? [value.granularity];
  const lo = minYear ?? value.year - 10;
  const hi = maxYear ?? value.year + 1;
  const years: number[] = [];
  for (let y = hi; y >= lo; y--) years.push(y);

  const emit = useCallback(
    (next: Partial<Period>) => {
      onChange?.({ ...value, ...next } as Period);
    },
    [onChange, value],
  );

  const onGranularity = useCallback(
    (granularity: PeriodGranularity) => {
      const next: Period = { granularity, year: value.year };
      if (granularity === "month") next.month = value.month ?? 1;
      if (granularity === "quarter") next.quarter = value.quarter ?? 1;
      onChange?.(next);
    },
    [onChange, value],
  );

  return (
    <span
      className={className}
      role="group"
      aria-label={ariaLabel ?? "Accounting period"}
      style={{ display: "inline-flex", gap: 8, alignItems: "center", ...style }}
    >
      {allowed.length > 1 && (
        <select
          aria-label="Period granularity"
          disabled={disabled}
          value={value.granularity}
          onChange={(e) => onGranularity(e.target.value as PeriodGranularity)}
          style={field}
        >
          {allowed.map((g) => (
            <option key={g} value={g}>
              {g === "month" ? "Month" : g === "quarter" ? "Quarter" : "Year"}
            </option>
          ))}
        </select>
      )}

      {value.granularity === "month" && (
        <select
          aria-label="Month"
          disabled={disabled}
          value={value.month ?? 1}
          onChange={(e) => emit({ month: Number(e.target.value) })}
          style={field}
        >
          {MONTHS.map((label, i) => (
            <option key={label} value={i + 1}>
              {label}
            </option>
          ))}
        </select>
      )}

      {value.granularity === "quarter" && (
        <select
          aria-label="Quarter"
          disabled={disabled}
          value={value.quarter ?? 1}
          onChange={(e) => emit({ quarter: Number(e.target.value) })}
          style={field}
        >
          {[1, 2, 3, 4].map((q) => (
            <option key={q} value={q}>
              {`Q${q}`}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Year"
        disabled={disabled}
        value={value.year}
        onChange={(e) => emit({ year: Number(e.target.value) })}
        style={field}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </span>
  );
}
