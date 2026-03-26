import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse, delay } from 'msw';
import { server } from '../mocks/server.test';
import type { PaginatedActivityResponse } from '@/types/api';
import ModalScreen from './modal';

const mockDismiss = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ dismiss: mockDismiss }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

const pageOne: PaginatedActivityResponse = {
  items: [
    { id: 'act_001', type: 'deposit', amount: 150000, currency: 'GBP', date: '2026-01-23T10:00:00Z', description: 'Payment from Customer ABC', status: 'completed' },
    { id: 'act_002', type: 'payout', amount: -50000, currency: 'GBP', date: '2026-01-22T10:00:00Z', description: 'Payout to Bank Account ****1234', status: 'completed' },
  ],
  next_cursor: 'act_002',
  has_more: true,
};

const pageTwo: PaginatedActivityResponse = {
  items: [
    { id: 'act_003', type: 'fee', amount: -2500, currency: 'GBP', date: '2026-01-21T10:00:00Z', description: 'Processing fee', status: 'completed' },
  ],
  next_cursor: null,
  has_more: false,
};

beforeEach(() => {
  mockDismiss.mockClear();
  server.use(
    http.get('http://localhost:3000/api/merchant/activity', () =>
      HttpResponse.json(pageOne)
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
    await waitFor(() => expect(screen.getByText('Recent Activity')).toBeTruthy());
  });

  it('renders the done button', async () => {
    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByLabelText('Close transactions')).toBeTruthy());
  });

  it('calls dismiss when done is pressed', async () => {
    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByLabelText('Close transactions')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('Close transactions'));
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders type, description and date for each item', async () => {
    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('Deposit')).toBeTruthy());
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('23 Jan 2026')).toBeTruthy();
  });

  it('renders amounts colour-coded', async () => {
    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('£1,500.00')).toBeTruthy());
    expect(screen.getByText('£-500.00')).toBeTruthy();
  });

  it('loads more items when scrolled to the end', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');
        return HttpResponse.json(cursor ? pageTwo : pageOne);
      })
    );

    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('Payment from Customer ABC')).toBeTruthy());

    fireEvent(screen.getByTestId('transaction-list'), 'endReached');

    await waitFor(() => expect(screen.getByText('Processing fee')).toBeTruthy());
  });

  it('shows a loading footer while more items are being fetched', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', async ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');
        if (cursor) {
          await delay(100);
          return HttpResponse.json(pageTwo);
        }
        return HttpResponse.json(pageOne);
      })
    );

    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('Payment from Customer ABC')).toBeTruthy());

    fireEvent(screen.getByTestId('transaction-list'), 'endReached');

    await waitFor(() => expect(screen.getByText('Loading more...')).toBeTruthy());
    await waitFor(() => expect(screen.queryByText('Loading more...')).toBeNull());
  });

  it('stops fetching after has_more is false', async () => {
    let requestCount = 0;
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', ({ request }) => {
        requestCount += 1;
        const cursor = new URL(request.url).searchParams.get('cursor');
        return HttpResponse.json(cursor ? pageTwo : pageOne);
      })
    );

    render(<ModalScreen />);
    await waitFor(() => expect(screen.getByText('Payment from Customer ABC')).toBeTruthy());

    fireEvent(screen.getByTestId('transaction-list'), 'endReached');
    await waitFor(() => expect(screen.getByText('Processing fee')).toBeTruthy());

    const countAfterTwoPages = requestCount;
    fireEvent(screen.getByTestId('transaction-list'), 'endReached');
    // allow any async work to settle
    await new Promise((r) => setTimeout(r, 50));
    expect(requestCount).toBe(countAfterTwoPages);
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
        HttpResponse.json(pageOne)
      )
    );

    fireEvent.press(screen.getByLabelText('Retry loading transactions'));
    await waitFor(() => expect(screen.getByText('Recent Activity')).toBeTruthy());
  });
});
