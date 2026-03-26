import { render, screen } from '@testing-library/react-native';
import { TransactionRow } from './TransactionRow';
import type { ActivityItem } from '@/types/api';

const depositItem: ActivityItem = {
  id: 'act_001',
  type: 'deposit',
  amount: 230000,
  currency: 'GBP',
  date: '2026-01-23T10:00:00Z',
  description: 'Payment from Customer ABC',
  status: 'completed',
};

const payoutItem: ActivityItem = {
  id: 'act_002',
  type: 'payout',
  amount: -187515,
  currency: 'GBP',
  date: '2026-01-22T10:00:00Z',
  description: 'Payout to Bank Account ****0117',
  status: 'completed',
};

describe('TransactionRow', () => {
  it('renders the capitalised type', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('Deposit')).toBeTruthy();
  });

  it('renders the description', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
  });

  it('renders the formatted date', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('23 Jan 2026')).toBeTruthy();
  });

  it('renders a positive amount', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('£2,300.00')).toBeTruthy();
  });

  it('renders a negative amount', () => {
    render(<TransactionRow item={payoutItem} />);
    expect(screen.getByText('£-1,875.15')).toBeTruthy();
  });

  it('renders the capitalised status', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('has a full spoken accessibility label', () => {
    render(<TransactionRow item={depositItem} />);
    expect(
      screen.getByLabelText(
        'Deposit, Payment from Customer ABC, 23 Jan 2026, 2,300.00 pounds, Completed'
      )
    ).toBeTruthy();
  });

  it('includes "minus" in the accessibility label for negative amounts', () => {
    render(<TransactionRow item={payoutItem} />);
    expect(
      screen.getByLabelText(
        'Payout, Payout to Bank Account ****0117, 22 Jan 2026, minus 1,875.15 pounds, Completed'
      )
    ).toBeTruthy();
  });
});
