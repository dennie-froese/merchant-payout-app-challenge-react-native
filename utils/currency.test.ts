import { formatAmount, formatAmountForA11y, CURRENCY_SYMBOLS } from './currency';

describe('CURRENCY_SYMBOLS', () => {
  it('maps GBP to £', () => {
    expect(CURRENCY_SYMBOLS.GBP).toBe('£');
  });

  it('maps EUR to €', () => {
    expect(CURRENCY_SYMBOLS.EUR).toBe('€');
  });
});

describe('formatAmount', () => {
  it('formats a positive GBP amount', () => {
    expect(formatAmount(500000, 'GBP')).toBe('£5,000.00');
  });

  it('formats a positive EUR amount', () => {
    expect(formatAmount(17092, 'EUR')).toBe('€170.92');
  });

  it('formats a negative GBP amount with symbol before minus', () => {
    expect(formatAmount(-186154, 'GBP')).toBe('£-1,861.54');
  });

  it('formats a negative EUR amount', () => {
    expect(formatAmount(-50000, 'EUR')).toBe('€-500.00');
  });

  it('formats zero', () => {
    expect(formatAmount(0, 'GBP')).toBe('£0.00');
  });

  it('formats a fractional pence amount', () => {
    expect(formatAmount(99, 'GBP')).toBe('£0.99');
  });
});

describe('formatAmountForA11y', () => {
  it('formats a positive GBP amount with full currency name', () => {
    expect(formatAmountForA11y(500000, 'GBP')).toBe('5,000.00 pounds');
  });

  it('formats a positive EUR amount with full currency name', () => {
    expect(formatAmountForA11y(17092, 'EUR')).toBe('170.92 euros');
  });

  it('prefixes negative amounts with "minus"', () => {
    expect(formatAmountForA11y(-186154, 'GBP')).toBe('minus 1,861.54 pounds');
  });

  it('prefixes negative EUR amounts with "minus"', () => {
    expect(formatAmountForA11y(-50000, 'EUR')).toBe('minus 500.00 euros');
  });

  it('formats zero without a minus prefix', () => {
    expect(formatAmountForA11y(0, 'GBP')).toBe('0.00 pounds');
  });
});
