import type { CSSProperties, ReactNode } from "react";
import { formatMoney } from "../format.js";
import { tonePalette, tokens, type StatusTone } from "../theme.js";

/** A single labeled figure inside a summary card. Presentation shape only. */
export interface SummaryItem {
  /** Stable key. */
  id: string;
  /** The figure's label. */
  label: ReactNode;
  /**
   * A pre-rendered value (string/element). Use this for anything that is not a
   * plain currency amount. If omitted, `amount` is formatted as money.
   */
  value?: ReactNode;
  /** A numeric amount, formatted as currency when `value` is not given. */
  amount?: number;
  /** Optional tone applied to the value (e.g. "danger" for an overdue total). */
  tone?: StatusTone;
  /** Optional secondary line under the value (a delta, a note, a period). */
  hint?: ReactNode;
}

export interface SummaryCardProps {
  /** Optional card title. */
  title?: ReactNode;
  /** The figures to show. */
  items: SummaryItem[];
  /** ISO 4217 currency code used when formatting `amount`. Defaults to "USD". */
  currency?: string;
  locale?: string;
  /** Columns in the grid. Defaults to the item count (single row). */
  columns?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * A compact summary block of labeled figures: report headers, dashboard tiles,
 * close/engagement summaries, an AR aging total, and the like. Each figure can
 * be a plain currency amount (formatted for you) or any pre-rendered value, with
 * an optional tone and a secondary hint line.
 *
 * Presentation only: it formats and lays out the figures you pass in.
 */
export function SummaryCard({
  title,
  items,
  currency = "USD",
  locale,
  columns,
  className,
  style,
}: SummaryCardProps) {
  const cols = columns ?? Math.max(1, items.length);
  return (
    <section
      className={className}
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.borderStrong}`,
        borderRadius: 12,
        padding: 16,
        ...style,
      }}
    >
      {title != null && (
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: tokens.textMuted,
          }}
        >
          {title}
        </h3>
      )}
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 16,
          margin: 0,
        }}
      >
        {items.map((item) => {
          const fg = item.tone ? tonePalette(item.tone).fg : tokens.text;
          const rendered =
            item.value ??
            (item.amount !== undefined
              ? formatMoney(item.amount, {
                  currency,
                  locale,
                  accountingNegative: true,
                })
              : "");
          return (
            <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <dt style={{ fontSize: 12, color: tokens.textMuted }}>{item.label}</dt>
              <dd
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: fg,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {rendered}
              </dd>
              {item.hint != null && (
                <div style={{ fontSize: 12, color: tokens.textMuted }}>{item.hint}</div>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
