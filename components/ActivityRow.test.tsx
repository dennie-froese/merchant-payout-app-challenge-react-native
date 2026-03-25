import { render, screen } from '@testing-library/react-native';
import { ActivityRow } from './ActivityRow';
import type { ActivityItem } from '@/types/api';

const depositItem: ActivityItem = {
  id: 'act_001',
  type: 'deposit',
  amount: 150000,
  currency: 'GBP',
  date: '2026-01-23T10:00:00Z',
  description: 'Payment from Customer ABC',
  status: 'completed',
};

const payoutItem: ActivityItem = {
  id: 'act_002',
  type: 'payout',
  amount: -50000,
  currency: 'GBP',
  date: '2026-01-22T10:00:00Z',
  description: 'Payout to Bank Account ****1234',
  status: 'completed',
};

describe('ActivityRow', () => {
  it('renders the item description', () => {
    render(<ActivityRow item={depositItem} />);
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
  });

  it('renders a positive amount', () => {
    render(<ActivityRow item={depositItem} />);
    expect(screen.getByText('£1,500.00')).toBeTruthy();
  });

  it('renders a negative amount with the symbol before the minus sign', () => {
    render(<ActivityRow item={payoutItem} />);
    expect(screen.getByText('£-500.00')).toBeTruthy();
  });

  it('has a spoken accessibility label for a positive amount', () => {
    render(<ActivityRow item={depositItem} />);
    expect(screen.getByLabelText('Payment from Customer ABC, 1,500.00 pounds')).toBeTruthy();
  });

  it('has a spoken accessibility label prefixed with "minus" for a negative amount', () => {
    render(<ActivityRow item={payoutItem} />);
    expect(
      screen.getByLabelText('Payout to Bank Account ****1234, minus 500.00 pounds')
    ).toBeTruthy();
  });

  it('renders EUR amounts correctly', () => {
    const eurItem: ActivityItem = { ...depositItem, amount: 17092, currency: 'EUR' };
    render(<ActivityRow item={eurItem} />);
    expect(screen.getByText('€170.92')).toBeTruthy();
  });
});
