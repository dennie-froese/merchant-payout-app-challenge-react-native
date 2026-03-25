import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server.test';
import type { PaginatedActivityResponse } from '@/types/api';
import ModalScreen from './modal';

const mockDismiss = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ dismiss: mockDismiss }),
}));

const mockActivity: PaginatedActivityResponse = {
  items: [
    { id: 'act_001', type: 'deposit', amount: 150000, currency: 'GBP', date: '2026-01-23T10:00:00Z', description: 'Payment from Customer ABC', status: 'completed' },
    { id: 'act_002', type: 'payout', amount: -50000, currency: 'GBP', date: '2026-01-22T10:00:00Z', description: 'Payout to Bank Account ****1234', status: 'completed' },
  ],
  next_cursor: null,
  has_more: false,
};

beforeEach(() => {
  mockDismiss.mockClear();
  server.use(
    http.get('http://localhost:3000/api/merchant/activity', () =>
      HttpResponse.json(mockActivity)
    )
  );
});

describe('ModalScreen', () => {
  it('shows a loading indicator before data arrives', () => {
    render(<ModalScreen />);
    expect(screen.getByLabelText('Loading transactions')).toBeTruthy();
  });

  it('renders the title', async () => {
    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('All Transactions')).toBeTruthy());
  });

  it('renders the close button', async () => {
    render(<ModalScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Close transactions')).toBeTruthy()
    );
  });

  it('calls dismiss when the close button is pressed', async () => {
    render(<ModalScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Close transactions')).toBeTruthy()
    );
    fireEvent.press(screen.getByLabelText('Close transactions'));
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders the list of activity items', async () => {
    render(<ModalScreen />);
    await waitFor(() =>
      expect(screen.getByText('Payment from Customer ABC')).toBeTruthy()
    );
    expect(screen.getByText('Payout to Bank Account ****1234')).toBeTruthy();
  });

  it('renders amounts for activity items', async () => {
    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('£1,500.00')).toBeTruthy());
    expect(screen.getByText('£-500.00')).toBeTruthy();
  });

  it('shows an error message when the request fails', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    render(<ModalScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Retry loading transactions')).toBeTruthy()
    );
  });

  it('reloads data when retry is pressed', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    render(<ModalScreen />);
    await waitFor(() =>
      expect(screen.getByLabelText('Retry loading transactions')).toBeTruthy()
    );

    server.use(
      http.get('http://localhost:3000/api/merchant/activity', () =>
        HttpResponse.json(mockActivity)
      )
    );

    fireEvent.press(screen.getByLabelText('Retry loading transactions'));
    await waitFor(() =>
      expect(screen.getByText('Payment from Customer ABC')).toBeTruthy()
    );
  });
});
