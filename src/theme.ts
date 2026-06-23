/**
 * Design tokens for maxed-ui.
 *
 * Every visual value used by the components is expressed as a CSS custom
 * property (a `var(--mx-*)` reference) with a hard-coded fallback baked in.
 * That means:
 *
 * - You can drop the components in with **zero setup**: the fallbacks render
 *   the default light theme without any stylesheet.
 * - You can opt into theming (including dark mode) by importing the optional
 *   stylesheet (`maxed-ui/styles.css`) or by defining the `--mx-*` variables
 *   yourself on any ancestor element.
 *
 * The tokens are presentation only. They carry no business meaning.
 */

/** A single token: the CSS variable name and its baked-in light-mode fallback. */
type Token = `var(${string}, ${string})`;

function token(name: string, fallback: string): Token {
  return `var(${name}, ${fallback})` as Token;
}

/**
 * The token set consumed by every component. Each value resolves to its
 * fallback unless a matching `--mx-*` custom property is in scope.
 */
export const tokens = {
  /** Surface / background colors. */
  surface: token("--mx-surface", "#ffffff"),
  surfaceMuted: token("--mx-surface-muted", "#f8f9fa"),
  /** Border / divider colors. */
  border: token("--mx-border", "#f1f3f5"),
  borderStrong: token("--mx-border-strong", "#e9ecef"),
  borderInput: token("--mx-border-input", "#ced4da"),
  /** Text colors. */
  text: token("--mx-text", "#212529"),
  textMuted: token("--mx-text-muted", "#868e96"),
  textSubtle: token("--mx-text-subtle", "#495057"),
  textFaint: token("--mx-text-faint", "#ced4da"),

  /** Tone palettes: background, foreground, and dot/accent per status tone. */
  toneNeutralBg: token("--mx-tone-neutral-bg", "#f1f3f5"),
  toneNeutralFg: token("--mx-tone-neutral-fg", "#495057"),
  toneNeutralDot: token("--mx-tone-neutral-dot", "#868e96"),

  toneInfoBg: token("--mx-tone-info-bg", "#e7f5ff"),
  toneInfoFg: token("--mx-tone-info-fg", "#1971c2"),
  toneInfoDot: token("--mx-tone-info-dot", "#1971c2"),

  toneSuccessBg: token("--mx-tone-success-bg", "#ebfbee"),
  toneSuccessFg: token("--mx-tone-success-fg", "#2b8a3e"),
  toneSuccessDot: token("--mx-tone-success-dot", "#2f9e44"),

  toneWarningBg: token("--mx-tone-warning-bg", "#fff9db"),
  toneWarningFg: token("--mx-tone-warning-fg", "#e67700"),
  toneWarningDot: token("--mx-tone-warning-dot", "#f08c00"),

  toneDangerBg: token("--mx-tone-danger-bg", "#fff5f5"),
  toneDangerFg: token("--mx-tone-danger-fg", "#c92a2a"),
  toneDangerDot: token("--mx-tone-danger-dot", "#e03131"),

  /** Reconciliation row tints, keyed to the same tone families. */
  reconMismatchBg: token("--mx-recon-mismatch-bg", "#fff9db"),
  reconOnlyLeftBg: token("--mx-recon-only-left-bg", "#fff5f5"),
  reconOnlyRightBg: token("--mx-recon-only-right-bg", "#e7f5ff"),
} as const;

/** The name of the data attribute that selects the dark theme. */
export const THEME_ATTR = "data-mx-theme";

export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

/** Resolve the {bg, fg, dot} token triple for a status tone. */
export function tonePalette(tone: StatusTone): {
  bg: Token;
  fg: Token;
  dot: Token;
} {
  switch (tone) {
    case "info":
      return { bg: tokens.toneInfoBg, fg: tokens.toneInfoFg, dot: tokens.toneInfoDot };
    case "success":
      return {
        bg: tokens.toneSuccessBg,
        fg: tokens.toneSuccessFg,
        dot: tokens.toneSuccessDot,
      };
    case "warning":
      return {
        bg: tokens.toneWarningBg,
        fg: tokens.toneWarningFg,
        dot: tokens.toneWarningDot,
      };
    case "danger":
      return {
        bg: tokens.toneDangerBg,
        fg: tokens.toneDangerFg,
        dot: tokens.toneDangerDot,
      };
    case "neutral":
    default:
      return {
        bg: tokens.toneNeutralBg,
        fg: tokens.toneNeutralFg,
        dot: tokens.toneNeutralDot,
      };
  }
}
