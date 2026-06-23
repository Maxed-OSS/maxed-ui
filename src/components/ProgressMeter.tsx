import type { CSSProperties, ReactNode } from "react";
import { tonePalette, tokens, type StatusTone } from "../theme.js";

export interface ProgressMeterProps {
  /** Completed count (e.g. closed tasks, received request items). */
  value: number;
  /** Total count. When 0 the meter renders empty and reports 0%. */
  total: number;
  /** Optional label shown above the bar (e.g. "Close checklist"). */
  label?: ReactNode;
  /**
   * What to show on the right of the label row:
   * - "fraction" -> "7 / 12" (default)
   * - "percent"  -> "58%"
   * - "none"     -> nothing
   */
  caption?: "fraction" | "percent" | "none";
  /**
   * Bar tone. "auto" (default) grades neutral -> info -> warning -> success as
   * completion rises; or pin a fixed tone.
   */
  tone?: StatusTone | "auto";
  /** Bar height in pixels. Defaults to 8. */
  height?: number;
  className?: string;
  style?: CSSProperties;
}

/** Clamp a ratio into the inclusive 0..1 range, treating non-finite as 0. */
function ratioOf(value: number, total: number): number {
  if (total <= 0) return 0;
  const r = value / total;
  if (!Number.isFinite(r)) return 0;
  return Math.min(1, Math.max(0, r));
}

function gradeTone(ratio: number): StatusTone {
  if (ratio >= 1) return "success";
  if (ratio >= 0.5) return "info";
  if (ratio > 0) return "warning";
  return "neutral";
}

/**
 * A horizontal completion meter for counted work: a monthly-close checklist,
 * a request list, an engagement's task progress, a reconciliation pass. It
 * renders an accessible progress bar with an optional label and a fraction or
 * percent caption.
 *
 * Presentation only: you pass the completed and total counts; it draws them.
 */
export function ProgressMeter({
  value,
  total,
  label,
  caption = "fraction",
  tone = "auto",
  height = 8,
  className,
  style,
}: ProgressMeterProps) {
  const ratio = ratioOf(value, total);
  const percent = Math.round(ratio * 100);
  const resolvedTone = tone === "auto" ? gradeTone(ratio) : tone;
  const palette = tonePalette(resolvedTone);

  const captionText =
    caption === "percent"
      ? `${percent}%`
      : caption === "fraction"
        ? `${value} / ${total}`
        : null;

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}
    >
      {(label != null || captionText != null) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
            fontSize: 12,
          }}
        >
          {label != null ? (
            <span style={{ color: tokens.textSubtle, fontWeight: 600 }}>{label}</span>
          ) : (
            <span />
          )}
          {captionText != null && (
            <span
              style={{
                color: tokens.textMuted,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {captionText}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total > 0 ? total : 0}
        aria-valuenow={Math.min(value, total > 0 ? total : 0)}
        aria-valuetext={`${percent}%`}
        aria-label={typeof label === "string" ? label : undefined}
        style={{
          width: "100%",
          height,
          borderRadius: 999,
          backgroundColor: tokens.surfaceMuted,
          overflow: "hidden",
        }}
      >
        <div
          data-tone={resolvedTone}
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: palette.dot,
            transition: "width 200ms ease",
          }}
        />
      </div>
    </div>
  );
}
