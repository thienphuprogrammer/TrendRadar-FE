/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale code (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a number as currency with custom symbol
 * @param amount - Amount to format
 * @param symbol - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrencyCustom(
  amount: number,
  symbol: string = '$',
  decimals: number = 2
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount));
  
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

/**
 * Format a number as compact currency (e.g., $1.2M, $500K)
 * @param amount - Amount to format
 * @param symbol - Currency symbol (default: '$')
 * @returns Formatted compact currency string
 */
export function formatCompactCurrency(
  amount: number,
  symbol: string = '$'
): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 1e9) {
    return `${sign}${symbol}${(absAmount / 1e9).toFixed(1)}B`;
  }
  if (absAmount >= 1e6) {
    return `${sign}${symbol}${(absAmount / 1e6).toFixed(1)}M`;
  }
  if (absAmount >= 1e3) {
    return `${sign}${symbol}${(absAmount / 1e3).toFixed(1)}K`;
  }
  return `${sign}${symbol}${absAmount.toFixed(0)}`;
}

/**
 * Parse a currency string to number
 * @param currencyStr - Currency string (e.g., "$1,234.56")
 * @returns Parsed number
 */
export function parseCurrency(currencyStr: string): number {
  const cleaned = currencyStr.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
}