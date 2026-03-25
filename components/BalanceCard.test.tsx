import { render, screen } from '@testing-library/react-native';
import { BalanceCard } from './BalanceCard';

describe('BalanceCard', () => {
  it('renders the "Account Balance" heading', () => {
    render(<BalanceCard availableBalance={500000} pendingBalance={25000} currency="GBP" />);
    expect(screen.getByText('Account Balance')).toBeTruthy();
  });

  it('renders the available balance amount', () => {
    render(<BalanceCard availableBalance={500000} pendingBalance={25000} currency="GBP" />);
    expect(screen.getByText('£5,000.00')).toBeTruthy();
  });

  it('renders the pending balance amount', () => {
    render(<BalanceCard availableBalance={500000} pendingBalance={25000} currency="GBP" />);
    expect(screen.getByText('£250.00')).toBeTruthy();
  });

  it('uses the EUR symbol for EUR currency', () => {
    render(<BalanceCard availableBalance={100000} pendingBalance={5000} currency="EUR" />);
    expect(screen.getByText('€1,000.00')).toBeTruthy();
    expect(screen.getByText('€50.00')).toBeTruthy();
  });

  it('has a spoken accessibility label for available balance', () => {
    render(<BalanceCard availableBalance={500000} pendingBalance={25000} currency="GBP" />);
    expect(screen.getByLabelText('Available balance: 5,000.00 pounds')).toBeTruthy();
  });

  it('has a spoken accessibility label for pending balance', () => {
    render(<BalanceCard availableBalance={500000} pendingBalance={25000} currency="GBP" />);
    expect(screen.getByLabelText('Pending balance: 250.00 pounds')).toBeTruthy();
  });

  it('uses the correct currency name in EUR accessibility labels', () => {
    render(<BalanceCard availableBalance={100000} pendingBalance={5000} currency="EUR" />);
    expect(screen.getByLabelText('Available balance: 1,000.00 euros')).toBeTruthy();
  });
});
