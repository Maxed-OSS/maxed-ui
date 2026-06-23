import type { CSSProperties, ReactNode } from "react";
import { formatMoney, formatNumber } from "../format.js";
import { tonePalette, type StatusTone } from "../theme.js";

/** Which direction of change should read as "good" (and so render in a positive tone). */
export type DeltaPolarity = "increase-good" | "decrease-good" | "neutral";

export interface DeltaBadgeProps {
  /**
   * The change to display. Either pass `value` (an absolute delta, formatted as
   * money or a plain number) or `percent` (a ratio where 0.05 renders as +5.0%),
   * or both. At least one is required.
   */
  value?: number;
  /** A percentage change expressed as a ratio (0.05 -> "+5.0%"). */
  percent?: number;
  /**
   * How to read the sign. With "increase-good" (the default) a positive change
   * is success-toned and a negative one is danger-toned; "decrease-good" flips
   * that (useful for costs, AR days, error counts); "neutral" never colors by
   * direction.
   */
  polarity?: DeltaPolarity;
  /** Format `value` as currency rather than a plain number. */
  asMoney?: boolean;
  /** ISO 4217 currency code used when `asMoney` is set. Defaults to "USD". */
  currency?: string;
  locale?: string;
  /** Fraction digits for `value`. Defaults to 0 for plain numbers, 2 for money. */
  fractionDigits?: number;
  /** Fraction digits for the percent. Defaults to 1. */
  percentDigits?: number;
  /** Show a directional arrow (up / down / flat). Defaults to true. */
  arrow?: boolean;
  /** Optional trailing context, e.g. "vs last month". */
  caption?: ReactNode;
  /** Optional title attribute / tooltip. */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const ARROWS = { up: "↑", down: "↓", flat: "→" } as const;

function withSign(text: string, direction: "up" | "down" | "flat"): string {
  if (direction === "up") return `+${text}`;
  if (direction === "down") return `-${text}`;
  return text;
}

/**
 * A compact, tone-coded badge for a period-over-period change: a revenue delta,
 * a budget variance, an AR-aging swing, a count of new open items. It shows a
 * direction arrow and the change as an absolute figure, a percent, or both, and
 * colors itself by whether the movement is favorable.
 *
 * Presentation only: it formats and tone-codes the numbers you pass in. It does
 * not compute the delta or decide what "favorable" means for your domain; that
 * is what `polarity` is for.
 */
export function DeltaBadge({
  value,
  percent,
  polarity = "increase-good",
  asMoney = false,
  currency = "USD",
  locale,
  fractionDigits,
  percentDigits = 1,
  arrow = true,
  caption,
  title,
  className,
  style,
}: DeltaBadgeProps) {
  // Pick the figure that decides direction: prefer an explicit value, else percent.
  const driver = value ?? percent ?? 0;
  const direction: "up" | "down" | "flat" =
    driver > 0 ? "up" : driver < 0 ? "down" : "flat";

  const tone: StatusTone =
    polarity === "neutral" || direction === "flat"
      ? "neutral"
      : (direction === "up") === (polarity === "increase-good")
        ? "success"
        : "danger";
  const palette = tonePalette(tone);

  const parts: string[] = [];
  if (value !== undefined) {
    const digits = fractionDigits ?? (asMoney ? 2 : 0);
    const magnitude = Math.abs(value);
    const formatted = asMoney
      ? formatMoney(magnitude, { currency, locale, fractionDigits: digits })
      : formatNumber(magnitude, digits, locale);
    parts.push(withSign(formatted, direction));
  }
  if (percent !== undefined) {
    const pct = formatNumber(Math.abs(percent) * 100, percentDigits, locale);
    parts.push(withSign(`${pct}%`, direction));
  }
  const text = parts.join(" / ");

  return (
    <span
      className={className}
      title={title}
      data-tone={tone}
      data-direction={direction}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "1px 8px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1.6,
          backgroundColor: palette.bg,
          color: palette.fg,
        }}
      >
        {arrow && <span aria-hidden="true">{ARROWS[direction]}</span>}
        {text}
      </span>
      {caption != null && (
        <span style={{ fontSize: 12, color: tonePalette("neutral").dot }}>
          {caption}
        </span>
      )}
    </span>
  );
}
