import type { Currency } from '@/types/api';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  EUR: '€',
};

const CURRENCY_NAMES: Record<Currency, string> = {
  GBP: 'pounds',
  EUR: 'euros',
};

export function formatAmount(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const abs = (Math.abs(amount) / 100).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `${symbol}-${abs}` : `${symbol}${abs}`;
}

export function formatAmountForA11y(amount: number, currency: Currency): string {
  const abs = (Math.abs(amount) / 100).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? 'minus ' : '';
  return `${sign}${abs} ${CURRENCY_NAMES[currency]}`;
}
