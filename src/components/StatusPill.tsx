import type { CSSProperties, ReactNode } from "react";

export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

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

const TONES: Record<StatusTone, { bg: string; fg: string; dot: string }> = {
  neutral: { bg: "#f1f3f5", fg: "#495057", dot: "#868e96" },
  info: { bg: "#e7f5ff", fg: "#1971c2", dot: "#1971c2" },
  success: { bg: "#ebfbee", fg: "#2b8a3e", dot: "#2f9e44" },
  warning: { bg: "#fff9db", fg: "#e67700", dot: "#f08c00" },
  danger: { bg: "#fff5f5", fg: "#c92a2a", dot: "#e03131" },
};

/**
 * A compact, color-coded status label — for ledger row states, reconciliation
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
  const palette = TONES[tone];
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
