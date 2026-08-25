/**
 * Indian Numbering & Rupee Currency Utility Engine
 * Strictly formats numbers according to the Indian numerical system (Lakhs and Crores).
 */

export interface FormatCurrencyOptions {
  compact?: boolean;    // e.g. ₹12.35 L vs ₹12,34,567
  decimals?: number;   // number of decimal places for compact view
  showSymbol?: boolean; // include ₹ prefix
}

/**
 * Formats a raw number into standard Indian comma grouping (e.g. 12,34,567).
 */
export function formatIndianNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  const rounded = Math.round(num);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  if (absStr.length <= 3) {
    return (isNegative ? '-' : '') + absStr;
  }

  // Last 3 digits
  const lastThree = absStr.substring(absStr.length - 3);
  // Remaining leading digits
  const remaining = absStr.substring(0, absStr.length - 3);

  // Group remainder by 2 digits from right to left
  const groupedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return (isNegative ? '-' : '') + groupedRemaining + ',' + lastThree;
}

/**
 * Formats currency into Indian Rupees with smart Lakhs (L) and Crores (Cr) compaction.
 */
export function formatIndianCurrency(
  amount: number | null | undefined,
  options: FormatCurrencyOptions = { compact: true, decimals: 2, showSymbol: true }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return options.showSymbol ? '₹0' : '0';
  }

  const symbol = options.showSymbol !== false ? '₹' : '';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const decimals = options.decimals ?? 2;

  if (options.compact) {
    // 1 Crore = 10,000,000
    if (absAmount >= 10000000) {
      const crVal = (absAmount / 10000000).toFixed(decimals);
      return `${isNegative ? '-' : ''}${symbol}${crVal} Cr`;
    }
    // 1 Lakh = 100,000
    if (absAmount >= 100000) {
      const lVal = (absAmount / 100000).toFixed(decimals);
      return `${isNegative ? '-' : ''}${symbol}${lVal} L`;
    }
    // Thousands >= 10,000
    if (absAmount >= 10000) {
      const kVal = (absAmount / 1000).toFixed(1);
      return `${isNegative ? '-' : ''}${symbol}${kVal} k`;
    }
  }

  return `${isNegative ? '-' : ''}${symbol}${formatIndianNumber(absAmount)}`;
}

/**
 * Formats full exact Rupee value with commas (e.g. ₹12,34,567.00)
 */
export function formatExactRupees(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const parts = abs.toFixed(2).split('.');
  const intPart = formatIndianNumber(parseInt(parts[0], 10));
  return `${isNegative ? '-' : ''}₹${intPart}.${parts[1]}`;
}
