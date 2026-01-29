/**
 * Format a number as currency
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 2
): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format a large number with abbreviations (K, M, B, T)
 */
export function formatNumber(
  value: number,
  decimals: number = 2
): string {
  const abbreviations = [
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' },
  ];

  for (const { threshold, suffix } of abbreviations) {
    if (Math.abs(value) >= threshold) {
      return `${(value / threshold).toFixed(decimals)}${suffix}`;
    }
  }

  return value.toFixed(decimals);
}

/**
 * Shorten an Ethereum address
 */
export function shortenAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format a timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number,
  displayDecimals: number = 4
): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const displayFractional = fractionalStr.slice(0, displayDecimals);

  return `${integerPart}.${displayFractional}`;
}
