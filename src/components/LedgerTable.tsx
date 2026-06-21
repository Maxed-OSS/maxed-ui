import type { CSSProperties, ReactNode } from "react";
import { formatMoney } from "../format.js";

/** A single ledger / register row. Presentation shape only. */
export interface LedgerEntry {
  id: string;
  date: string;
  /** Short reference / document number, e.g. a check or invoice number. */
  reference?: string;
  description: string;
  /** Optional account or category label. */
  account?: string;
  /** Debit amount in major units. Use either debit or credit per row. */
  debit?: number | null;
  /** Credit amount in major units. */
  credit?: number | null;
  /** Optional rendered status (e.g. a <StatusPill>). */
  status?: ReactNode;
}

export interface LedgerTableProps {
  entries: LedgerEntry[];
  /** ISO 4217 currency code for amount formatting. Defaults to "USD". */
  currency?: string;
  locale?: string;
  /** Show a trailing running-balance column (debit positive, credit negative). */
  showRunningBalance?: boolean;
  /** Opening balance used as the start of the running balance. Defaults to 0. */
  openingBalance?: number;
  /** Render a footer row with column totals. Defaults to true. */
  showTotals?: boolean;
  /** Message shown when there are no entries. */
  emptyMessage?: ReactNode;
  /** Invoked when a row is clicked. */
  onRowClick?: (entry: LedgerEntry) => void;
  className?: string;
  style?: CSSProperties;
  caption?: ReactNode;
}

const cell: CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #f1f3f5",
  fontSize: 14,
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
  color: "#868e96",
  borderBottom: "2px solid #e9ecef",
};

function amount(
  value: number | null | undefined,
  currency: string,
  locale?: string,
): string {
  if (value === null || value === undefined || value === 0) return "";
  return formatMoney(value, { currency, locale });
}

/**
 * A ledger / register data table for accounting UIs. Renders dated rows with
 * debit/credit columns, an optional running balance, and column totals.
 *
 * Presentation only: it does no double-entry validation and stores nothing —
 * it just lays out the rows you give it.
 */
export function LedgerTable({
  entries,
  currency = "USD",
  locale,
  showRunningBalance = false,
  openingBalance = 0,
  showTotals = true,
  emptyMessage = "No entries to display.",
  onRowClick,
  className,
  style,
  caption,
}: LedgerTableProps) {
  let running = openingBalance;
  const hasStatus = entries.some((e) => e.status != null);

  const totalDebit = entries.reduce((sum, e) => sum + (e.debit ?? 0), 0);
  const totalCredit = entries.reduce((sum, e) => sum + (e.credit ?? 0), 0);

  return (
    <table
      className={className}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#fff",
        ...style,
      }}
    >
      {caption && (
        <caption
          style={{
            textAlign: "left",
            padding: "0 0 8px",
            fontSize: 13,
            color: "#868e96",
          }}
        >
          {caption}
        </caption>
      )}
      <thead>
        <tr>
          <th style={headCell}>Date</th>
          <th style={headCell}>Ref</th>
          <th style={headCell}>Description</th>
          <th style={headCell}>Account</th>
          {hasStatus && <th style={headCell}>Status</th>}
          <th style={{ ...headCell, textAlign: "right" }}>Debit</th>
          <th style={{ ...headCell, textAlign: "right" }}>Credit</th>
          {showRunningBalance && (
            <th style={{ ...headCell, textAlign: "right" }}>Balance</th>
          )}
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 ? (
          <tr>
            <td
              colSpan={hasStatus ? 8 : 7}
              style={{ ...cell, textAlign: "center", color: "#868e96" }}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          entries.map((entry) => {
            running += (entry.debit ?? 0) - (entry.credit ?? 0);
            const clickable = Boolean(onRowClick);
            return (
              <tr
                key={entry.id}
                onClick={clickable ? () => onRowClick?.(entry) : undefined}
                style={{ cursor: clickable ? "pointer" : "default" }}
              >
                <td style={{ ...cell, whiteSpace: "nowrap" }}>{entry.date}</td>
                <td style={{ ...cell, color: "#868e96" }}>
                  {entry.reference ?? ""}
                </td>
                <td style={cell}>{entry.description}</td>
                <td style={{ ...cell, color: "#495057" }}>
                  {entry.account ?? ""}
                </td>
                {hasStatus && <td style={cell}>{entry.status}</td>}
                <td style={numCell}>{amount(entry.debit, currency, locale)}</td>
                <td style={numCell}>
                  {amount(entry.credit, currency, locale)}
                </td>
                {showRunningBalance && (
                  <td style={{ ...numCell, fontWeight: 600 }}>
                    {formatMoney(running, {
                      currency,
                      locale,
                      accountingNegative: true,
                    })}
                  </td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
      {showTotals && entries.length > 0 && (
        <tfoot>
          <tr>
            <td
              style={{ ...cell, fontWeight: 700, borderTop: "2px solid #e9ecef" }}
              colSpan={hasStatus ? 5 : 4}
            >
              Totals
            </td>
            <td
              style={{
                ...numCell,
                fontWeight: 700,
                borderTop: "2px solid #e9ecef",
              }}
            >
              {formatMoney(totalDebit, { currency, locale })}
            </td>
            <td
              style={{
                ...numCell,
                fontWeight: 700,
                borderTop: "2px solid #e9ecef",
              }}
            >
              {formatMoney(totalCredit, { currency, locale })}
            </td>
            {showRunningBalance && (
              <td
                style={{
                  ...numCell,
                  fontWeight: 700,
                  borderTop: "2px solid #e9ecef",
                }}
              >
                {formatMoney(running, {
                  currency,
                  locale,
                  accountingNegative: true,
                })}
              </td>
            )}
          </tr>
        </tfoot>
      )}
    </table>
  );
}
