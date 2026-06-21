import { describe, expect, it } from "vitest";
import { tokens, tonePalette, THEME_ATTR, type StatusTone } from "./theme.js";

describe("design tokens", () => {
  it("expresses every token as a var() with a baked-in fallback", () => {
    for (const value of Object.values(tokens)) {
      expect(value).toMatch(/^var\(--mx-[a-z-]+, .+\)$/);
    }
  });

  it("exposes the theme attribute name", () => {
    expect(THEME_ATTR).toBe("data-mx-theme");
  });
});

describe("tonePalette", () => {
  const tones: StatusTone[] = [
    "neutral",
    "info",
    "success",
    "warning",
    "danger",
  ];

  it("returns a bg/fg/dot triple for each tone", () => {
    for (const tone of tones) {
      const palette = tonePalette(tone);
      expect(palette).toHaveProperty("bg");
      expect(palette).toHaveProperty("fg");
      expect(palette).toHaveProperty("dot");
      expect(palette.bg).toContain(`--mx-tone-${tone}-bg`);
      expect(palette.fg).toContain(`--mx-tone-${tone}-fg`);
      expect(palette.dot).toContain(`--mx-tone-${tone}-dot`);
    }
  });

  it("falls back to the neutral palette for an unknown tone", () => {
    // Defensive: a value outside the union resolves to neutral rather than undefined.
    const palette = tonePalette("unknown" as StatusTone);
    expect(palette.bg).toBe(tokens.toneNeutralBg);
  });
});
