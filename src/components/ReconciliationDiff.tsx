import type { CSSProperties, ReactNode } from "react";
import { formatMoney } from "../format.js";
import { tokens } from "../theme.js";
import { StatusPill, type StatusTone } from "./StatusPill.js";

/**
 * A line that appears on one or both sides of a reconciliation (e.g. the
 * book/ledger side vs. the bank/statement side). Presentation shape only.
 */
export interface ReconLine {
  id: string;
  date: string;
  description: string;
  amount: number;
}

/**
 * The result of pairing up two sides of a reconciliation. The caller does the
 * matching (this component renders the outcome).
 *
 * - `matched`: both sides agree.
 * - `mismatched`: a pair exists but amounts/dates differ.
 * - `onlyLeft` / `onlyRight`: present on only one side.
 */
export interface ReconRow {
  id: string;
  status: "matched" | "mismatched" | "onlyLeft" | "onlyRight";
  left?: ReconLine;
  right?: ReconLine;
}

export interface ReconciliationDiffProps {
  rows: ReconRow[];
  /** Heading for the left (book) column. Defaults to "Books". */
  leftLabel?: ReactNode;
  /** Heading for the right (bank) column. Defaults to "Bank". */
  rightLabel?: ReactNode;
  currency?: string;
  locale?: string;
  /** Hide rows whose two sides already match. */
  onlyDifferences?: boolean;
  /** Render a summary bar of counts by status. Defaults to true. */
  showSummary?: boolean;
  emptyMessage?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const STATUS_META: Record<
  ReconRow["status"],
  { tone: StatusTone; label: string }
> = {
  matched: { tone: "success", label: "Matched" },
  mismatched: { tone: "warning", label: "Mismatch" },
  onlyLeft: { tone: "danger", label: "Books only" },
  onlyRight: { tone: "info", label: "Bank only" },
};

const ROW_BG: Record<ReconRow["status"], string> = {
  matched: "transparent",
  mismatched: tokens.reconMismatchBg,
  onlyLeft: tokens.reconOnlyLeftBg,
  onlyRight: tokens.reconOnlyRightBg,
};

const cell: CSSProperties = {
  padding: "8px 12px",
  borderBottom: `1px solid ${tokens.border}`,
  fontSize: 14,
  color: tokens.text,
  verticalAlign: "top",
};

const numCell: CSSProperties = {
  ...cell,
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
};

const headCell: CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: tokens.textMuted,
  borderBottom: `2px solid ${tokens.borderStrong}`,
};

function side(line: ReconLine | undefined, currency: string, locale?: string) {
  if (!line) {
    return (
      <>
        <td style={{ ...cell, color: tokens.textFaint }}>—</td>
        <td style={{ ...numCell, color: tokens.textFaint }}>—</td>
      </>
    );
  }
  return (
    <>
      <td style={cell}>
        <div>{line.description}</div>
        <div style={{ fontSize: 12, color: tokens.textMuted }}>{line.date}</div>
      </td>
      <td style={numCell}>
        {formatMoney(line.amount, { currency, locale, accountingNegative: true })}
      </td>
    </>
  );
}

/**
 * A side-by-side reconciliation diff viewer: left column is the books, right
 * is the bank/statement, each row tagged matched / mismatch / one-sided.
 *
 * Presentation only — it renders pre-computed reconciliation rows and never
 * decides what matches what.
 */
export function ReconciliationDiff({
  rows,
  leftLabel = "Books",
  rightLabel = "Bank",
  currency = "USD",
  locale,
  onlyDifferences = false,
  showSummary = true,
  emptyMessage = "Nothing to reconcile.",
  className,
  style,
}: ReconciliationDiffProps) {
  const visible = onlyDifferences
    ? rows.filter((r) => r.status !== "matched")
    : rows;

  const counts = rows.reduce<Record<ReconRow["status"], number>>(
    (acc, r) => {
      acc[r.status] += 1;
      return acc;
    },
    { matched: 0, mismatched: 0, onlyLeft: 0, onlyRight: 0 },
  );

  return (
    <div className={className} style={style}>
      {showSummary && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {(Object.keys(STATUS_META) as ReconRow["status"][]).map((status) => (
            <StatusPill key={status} tone={STATUS_META[status].tone} dot>
              {STATUS_META[status].label}: {counts[status]}
            </StatusPill>
          ))}
        </div>
      )}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: tokens.surface,
        }}
      >
        <thead>
          <tr>
            <th style={headCell} colSpan={2}>
              {leftLabel}
            </th>
            <th style={headCell} colSpan={2}>
              {rightLabel}
            </th>
            <th style={{ ...headCell, textAlign: "right" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{ ...cell, textAlign: "center", color: tokens.textMuted }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            visible.map((row) => {
              const meta = STATUS_META[row.status];
              return (
                <tr key={row.id} style={{ background: ROW_BG[row.status] }}>
                  {side(row.left, currency, locale)}
                  {side(row.right, currency, locale)}
                  <td style={{ ...cell, textAlign: "right" }}>
                    <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
