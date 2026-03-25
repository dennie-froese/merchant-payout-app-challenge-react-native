import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server.test';
import type { MerchantDataResponse } from '@/types/api';
import HomeScreen from './index';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

const mockData: MerchantDataResponse = {
  available_balance: 500000,
  pending_balance: 25000,
  currency: 'GBP',
  activity: [
    { id: 'act_001', type: 'deposit', amount: 150000, currency: 'GBP', date: '2026-01-23T10:00:00Z', description: 'Payment from Customer ABC', status: 'completed' },
    { id: 'act_002', type: 'payout', amount: -50000, currency: 'GBP', date: '2026-01-22T10:00:00Z', description: 'Payout to Bank Account ****1234', status: 'completed' },
    { id: 'act_003', type: 'deposit', amount: 230000, currency: 'GBP', date: '2026-01-21T10:00:00Z', description: 'Payment from Customer XYZ', status: 'completed' },
    { id: 'act_004', type: 'fee', amount: -2500, currency: 'GBP', date: '2026-01-20T10:00:00Z', description: 'Monthly service fee', status: 'completed' },
  ],
};

beforeEach(() => {
  mockPush.mockClear();
  server.use(
    http.get('http://localhost:3000/api/merchant', () =>
      HttpResponse.json(mockData)
    )
  );
});

describe('HomeScreen', () => {
  it('shows a loading indicator before data arrives', () => {
    render(<HomeScreen />);
    expect(screen.getByLabelText('Loading account data')).toBeTruthy();
  });

  it('renders the page title', async () => {
    render(<HomeScreen />);
    await waitFor(() => expect(screen.getByText('Business Account')).toBeTruthy());
  });

  it('renders the account balance section', async () => {
    render(<HomeScreen />);
    await waitFor(() => expect(screen.getByText('Account Balance')).toBeTruthy());
    expect(screen.getByText('£5,000.00')).toBeTruthy();
    expect(screen.getByText('£250.00')).toBeTruthy();
  });

  it('renders only the 3 most recent activity items', async () => {
    render(<HomeScreen />);
    await waitFor(() => expect(screen.getByText('Recent Activity')).toBeTruthy());
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('Payout to Bank Account ****1234')).toBeTruthy();
    expect(screen.getByText('Payment from Customer XYZ')).toBeTruthy();
    expect(screen.queryByText('Monthly service fee')).toBeNull();
  });

  it('renders the Show More button', async () => {
    render(<HomeScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Show more activity')).toBeTruthy()
    );
  });

  it('show more button navigates to the modal', async () => {
    render(<HomeScreen />);
    await waitFor(() => expect(screen.getByLabelText('Show more activity')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('Show more activity'));
    expect(mockPush).toHaveBeenCalledWith('/modal');
  });

  it('shows an error message when the request fails', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    render(<HomeScreen />);
    await waitFor(() =>
      expect(screen.getByText('Failed to load account data')).toBeTruthy()
    );
  });

  it('shows a retry button on error', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    render(<HomeScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Retry loading account data')).toBeTruthy()
    );
  });

  it('reloads data when retry is pressed', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    render(<HomeScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Retry loading account data')).toBeTruthy()
    );

    server.use(
      http.get('http://localhost:3000/api/merchant', () => HttpResponse.json(mockData))
    );

    fireEvent.press(screen.getByLabelText('Retry loading account data'));
    await waitFor(() => expect(screen.getByText('Account Balance')).toBeTruthy());
  });
});
