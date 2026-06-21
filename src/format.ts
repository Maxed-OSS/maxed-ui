/**
 * Presentation-only formatting helpers.
 *
 * These deal purely with how numbers and money are *displayed*. They contain
 * no rounding rules, tax logic, or accounting policy — just locale formatting.
 */

export interface MoneyFormatOptions {
  /** ISO 4217 currency code, e.g. "USD", "EUR", "GBP". Defaults to "USD". */
  currency?: string;
  /** BCP 47 locale, e.g. "en-US". Defaults to the host's locale. */
  locale?: string;
  /** Minimum/maximum fraction digits. Defaults to currency convention. */
  fractionDigits?: number;
  /** Render negatives in accounting style, e.g. (1,234.00) instead of -1,234.00. */
  accountingNegative?: boolean;
}

/**
 * Format a numeric amount as a currency string for display.
 *
 * @example formatMoney(1234.5) // "$1,234.50"
 * @example formatMoney(-50, { accountingNegative: true }) // "($50.00)"
 */
export function formatMoney(
  amount: number,
  options: MoneyFormatOptions = {},
): string {
  const {
    currency = "USD",
    locale,
    fractionDigits,
    accountingNegative = false,
  } = options;

  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  if (accountingNegative && amount < 0) {
    return `(${fmt.format(Math.abs(amount))})`;
  }
  return fmt.format(amount);
}

/**
 * Format a plain number for display (no currency symbol).
 *
 * @example formatNumber(1234.5, 2) // "1,234.50"
 */
export function formatNumber(
  value: number,
  fractionDigits?: number,
  locale?: string,
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Parse a user-typed money string into a number, tolerating common input:
 * grouping separators, currency symbols, whitespace, and accounting parens
 * for negatives. Returns `null` if nothing numeric could be parsed.
 *
 * Presentation-only: this is for input fields, not for ledger math.
 *
 * @example parseMoney("$1,234.50") // 1234.5
 * @example parseMoney("(50.00)")   // -50
 */
export function parseMoney(input: string): number | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed === "") return null;

  const negative = /^\(.*\)$/.test(trimmed) || trimmed.includes("-");
  // Strip everything except digits and decimal points.
  const cleaned = trimmed.replace(/[^0-9.]/g, "");
  if (cleaned === "" || cleaned === ".") return null;

  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) return null;

  return negative ? -value : value;
}
