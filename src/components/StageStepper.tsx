import type { CSSProperties, ReactNode } from "react";
import { tokens } from "../theme.js";

/** State of a single step in an ordered workflow. */
export type StepState = "done" | "current" | "upcoming";

/** A single step in an ordered workflow. Presentation shape only. */
export interface Step {
  /** Stable key for the step. */
  id: string;
  /** Visible label. */
  label: ReactNode;
  /** Optional short description shown under the label. */
  description?: ReactNode;
  /**
   * Explicit state. If omitted, the component derives state from
   * `activeIndex`: steps before it are "done", the matching step is
   * "current", and steps after it are "upcoming".
   */
  state?: StepState;
}

export interface StageStepperProps {
  /** The ordered steps to render. */
  steps: Step[];
  /**
   * Index of the active (current) step. Used to derive each step's state when
   * a step does not set its own `state`. Defaults to 0.
   */
  activeIndex?: number;
  /** Layout direction. Defaults to "horizontal". */
  orientation?: "horizontal" | "vertical";
  /** Invoked when a step is clicked. Makes the steps focusable buttons. */
  onStepClick?: (step: Step, index: number) => void;
  /** Accessible label for the whole stepper. */
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

const toneForState: Record<StepState, { ring: string; fill: string; fg: string }> = {
  done: { ring: tokens.toneSuccessDot, fill: tokens.toneSuccessDot, fg: tokens.surface },
  current: { ring: tokens.toneInfoDot, fill: tokens.toneInfoDot, fg: tokens.surface },
  upcoming: { ring: tokens.borderInput, fill: tokens.surface, fg: tokens.textMuted },
};

function deriveState(
  step: Step,
  index: number,
  activeIndex: number,
): StepState {
  if (step.state) return step.state;
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "current";
  return "upcoming";
}

/**
 * An ordered stepper for workflow stages: engagement progress, a monthly-close
 * checklist, a tax-prep stage model, an onboarding flow, and the like. It draws
 * a numbered marker per step (a check when done), the step label and optional
 * description, and the connectors between them.
 *
 * The caller owns the workflow and decides which step is active; this component
 * lays the steps out and reflects their state.
 */
export function StageStepper({
  steps,
  activeIndex = 0,
  orientation = "horizontal",
  onStepClick,
  "aria-label": ariaLabel,
  className,
  style,
}: StageStepperProps) {
  const horizontal = orientation === "horizontal";
  const clickable = Boolean(onStepClick);

  return (
    <ol
      className={className}
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        alignItems: horizontal ? "flex-start" : "stretch",
        gap: 0,
        margin: 0,
        padding: 0,
        listStyle: "none",
        ...style,
      }}
    >
      {steps.map((step, index) => {
        const state = deriveState(step, index, activeIndex);
        const tone = toneForState[state];
        const isLast = index === steps.length - 1;
        const marker = (
          <span
            aria-hidden="true"
            style={{
              flex: "0 0 auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: `2px solid ${tone.ring}`,
              backgroundColor: tone.fill,
              color: tone.fg,
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {state === "done" ? "✓" : index + 1}
          </span>
        );

        const body = (
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: state === "current" ? 700 : 600,
                color: state === "upcoming" ? tokens.textMuted : tokens.text,
              }}
            >
              {step.label}
            </span>
            {step.description != null && (
              <span style={{ fontSize: 12, color: tokens.textMuted }}>
                {step.description}
              </span>
            )}
          </span>
        );

        const labelCluster = clickable ? (
          <button
            type="button"
            onClick={() => onStepClick?.(step, index)}
            aria-current={state === "current" ? "step" : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              textAlign: "left",
            }}
          >
            {marker}
            {body}
          </button>
        ) : (
          <span
            aria-current={state === "current" ? "step" : undefined}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            {marker}
            {body}
          </span>
        );

        const connector = !isLast && (
          <span
            aria-hidden="true"
            style={
              horizontal
                ? {
                    flex: "1 1 auto",
                    height: 2,
                    minWidth: 24,
                    margin: "0 8px",
                    alignSelf: "center",
                    backgroundColor:
                      state === "done" ? tokens.toneSuccessDot : tokens.border,
                  }
                : {
                    width: 2,
                    minHeight: 20,
                    margin: "4px 0 4px 12px",
                    backgroundColor:
                      state === "done" ? tokens.toneSuccessDot : tokens.border,
                  }
            }
          />
        );

        return (
          <li
            key={step.id}
            data-state={state}
            style={{
              display: "flex",
              flexDirection: horizontal ? "row" : "column",
              alignItems: horizontal ? "center" : "stretch",
              flex: horizontal && !isLast ? "1 1 0" : "0 0 auto",
            }}
          >
            {labelCluster}
            {connector}
          </li>
        );
      })}
    </ol>
  );
}
