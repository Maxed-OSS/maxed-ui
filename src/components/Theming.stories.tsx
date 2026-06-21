import type { Meta, StoryObj } from "@storybook/react";
import { LedgerTable } from "./LedgerTable.js";
import { ReconciliationDiff } from "./ReconciliationDiff.js";
import { StatusPill, type StatusTone } from "./StatusPill.js";
import { sampleLedger, sampleReconciliation } from "../fixtures/sample.js";

/**
 * maxed-ui is themed entirely with CSS custom properties (`--mx-*`). The
 * components carry baked-in light-mode fallbacks, so they render with zero
 * setup. Importing `maxed-ui/styles.css` adds themeable tokens plus automatic
 * and explicit dark mode (`data-mx-theme="dark"`).
 *
 * Use the "Theme" toolbar control above to flip the whole canvas.
 */
const meta: Meta = {
  title: "Foundations/Theming",
};
export default meta;

type Story = StoryObj;

const tones: StatusTone[] = ["neutral", "info", "success", "warning", "danger"];

function Palette() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tones.map((tone) => (
        <StatusPill key={tone} tone={tone} dot>
          {tone}
        </StatusPill>
      ))}
    </div>
  );
}

/** Everything at once, driven by the toolbar Theme control. */
export const Showcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, maxWidth: 820 }}>
      <Palette />
      <LedgerTable entries={sampleLedger} showRunningBalance openingBalance={0} />
      <ReconciliationDiff rows={sampleReconciliation} />
    </div>
  ),
};

/**
 * Both themes forced side by side via explicit `data-mx-theme`. This renders
 * regardless of the toolbar control or the OS preference.
 */
export const LightVsDark: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
      <div data-mx-theme="light" style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
        <h4 style={{ margin: "0 0 12px", color: "#212529" }}>Light</h4>
        <Palette />
        <div style={{ height: 12 }} />
        <LedgerTable entries={sampleLedger.slice(0, 3)} />
      </div>
      <div data-mx-theme="dark" style={{ background: "#141517", padding: 16, borderRadius: 8 }}>
        <h4 style={{ margin: "0 0 12px", color: "#e9ecef" }}>Dark</h4>
        <Palette />
        <div style={{ height: 12 }} />
        <LedgerTable entries={sampleLedger.slice(0, 3)} />
      </div>
    </div>
  ),
};
