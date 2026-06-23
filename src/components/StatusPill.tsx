import type { CSSProperties, ReactNode } from "react";
import { tonePalette, type StatusTone } from "../theme.js";

export type { StatusTone };

export interface StatusPillProps {
  /** Visual tone of the pill. */
  tone?: StatusTone;
  /** Pill label. */
  children: ReactNode;
  /** Show a small leading dot indicator. */
  dot?: boolean;
  /** Optional title attribute / tooltip. */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A compact, color-coded status label for ledger row states, reconciliation
 * status, engagement stages, etc. Presentation only; the caller decides which
 * tone maps to which domain meaning.
 */
export function StatusPill({
  tone = "neutral",
  children,
  dot = false,
  title,
  className,
  style,
}: StatusPillProps) {
  const palette = tonePalette(tone);
  return (
    <span
      className={className}
      title={title}
      data-tone={tone}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.6,
        whiteSpace: "nowrap",
        backgroundColor: palette.bg,
        color: palette.fg,
        ...style,
      }}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: palette.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}
