import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server.test';
import PayoutsScreen from './payouts';

jest.mock('@/modules/screen-security', () => ({
  getDeviceId: jest.fn(() => 'test-device-id'),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

const VALID_IBAN = 'GB29NWBK60161331926819';
const VALID_AMOUNT = '400';

function fillForm(amount = VALID_AMOUNT, iban = VALID_IBAN) {
  fireEvent.changeText(screen.getByLabelText('Payout amount'), amount);
  fireEvent.changeText(screen.getByLabelText('Destination IBAN'), iban);
}

beforeEach(() => {
  server.use(
    http.post('http://localhost:3000/api/payouts', () =>
      HttpResponse.json(
        { id: 'pay_001', status: 'completed', amount: 40000, currency: 'GBP', iban: VALID_IBAN, created_at: '2026-01-23T10:00:00Z' },
        { status: 201 }
      )
    )
  );
});

describe('PayoutsScreen', () => {
  describe('form', () => {
    it('renders all form fields and the confirm button', () => {
      render(<PayoutsScreen />);
      expect(screen.getByText('Send Payout')).toBeTruthy();
      expect(screen.getByLabelText('Payout amount')).toBeTruthy();
      expect(screen.getByLabelText(/Select currency/)).toBeTruthy();
      expect(screen.getByLabelText('Destination IBAN')).toBeTruthy();
      expect(screen.getByLabelText('Confirm payout')).toBeTruthy();
    });

    it('defaults currency to GBP', () => {
      render(<PayoutsScreen />);
      expect(screen.getByLabelText('Select currency, currently GBP')).toBeTruthy();
    });

    it('disables confirm when form is empty', () => {
      render(<PayoutsScreen />);
      expect(screen.getByLabelText('Confirm payout')).toBeDisabled();
    });

    it('disables confirm when amount is zero', () => {
      render(<PayoutsScreen />);
      fillForm('0', VALID_IBAN);
      expect(screen.getByLabelText('Confirm payout')).toBeDisabled();
    });

    it('disables confirm when amount is negative', () => {
      render(<PayoutsScreen />);
      fillForm('-100', VALID_IBAN);
      expect(screen.getByLabelText('Confirm payout')).toBeDisabled();
    });

    it('disables confirm when IBAN is empty', () => {
      render(<PayoutsScreen />);
      fillForm(VALID_AMOUNT, '');
      expect(screen.getByLabelText('Confirm payout')).toBeDisabled();
    });

    it('enables confirm when amount is positive and IBAN is provided', () => {
      render(<PayoutsScreen />);
      fillForm();
      expect(screen.getByLabelText('Confirm payout')).not.toBeDisabled();
    });
  });

  describe('currency picker', () => {
    it('opens the currency picker on press', async () => {
      render(<PayoutsScreen />);
      fireEvent.press(screen.getByLabelText('Select currency, currently GBP'));
      await waitFor(() => expect(screen.getByLabelText('Euro')).toBeTruthy());
    });

    it('updates currency when a new option is selected', async () => {
      render(<PayoutsScreen />);
      fireEvent.press(screen.getByLabelText('Select currency, currently GBP'));
      await waitFor(() => expect(screen.getByLabelText('Euro')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Euro'));
      await waitFor(() =>
        expect(screen.getByLabelText('Select currency, currently EUR')).toBeTruthy()
      );
    });
  });

  describe('confirmation modal', () => {
    it('shows confirmation modal with amount, currency and masked IBAN', async () => {
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      expect(screen.getByText('£400.00')).toBeTruthy();
      expect(screen.getByText('GBP')).toBeTruthy();
      expect(screen.getByText('GB29****...****6819')).toBeTruthy();
    });

    it('dismisses confirmation modal on cancel', async () => {
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Cancel payout'));
      await waitFor(() =>
        expect(screen.queryByText('Confirm Payout')).toBeNull()
      );
    });
  });

  describe('success', () => {
    it('shows success screen after a successful submission', async () => {
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Payout Completed')).toBeTruthy());
    });

    it('shows the formatted payout amount on the success screen', async () => {
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() =>
        expect(screen.getByText(/Your payout of £400\.00 has been processed successfully\./)).toBeTruthy()
      );
    });

    it('resets the form when "Create Another Payout" is pressed', async () => {
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Payout Completed')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Create another payout'));
      await waitFor(() => expect(screen.getByText('Send Payout')).toBeTruthy());
      expect(screen.getByLabelText('Payout amount').props.value).toBe('');
    });
  });

  describe('device identity', () => {
    it('sends device_id in the payout request body', async () => {
      let capturedBody: Record<string, unknown> = {};
      server.use(
        http.post('http://localhost:3000/api/payouts', async ({ request }) => {
          capturedBody = await request.json() as Record<string, unknown>;
          return HttpResponse.json(
            { id: 'pay_001', status: 'completed', amount: 40000, currency: 'GBP', iban: VALID_IBAN, created_at: '2026-01-23T10:00:00Z' },
            { status: 201 }
          );
        })
      );

      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Payout Completed')).toBeTruthy());
      expect(capturedBody.device_id).toBe('test-device-id');
    });
  });

  describe('error states', () => {
    it('shows error screen on 503 with service unavailable message', async () => {
      server.use(
        http.post('http://localhost:3000/api/payouts', () =>
          HttpResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
        )
      );
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
      expect(
        screen.getByText('Service temporarily unavailable. Please try again later.')
      ).toBeTruthy();
    });

    it('shows error screen on 400 with insufficient funds message', async () => {
      server.use(
        http.post('http://localhost:3000/api/payouts', () =>
          HttpResponse.json({ error: 'Insufficient funds' }, { status: 400 })
        )
      );
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
      expect(screen.getByText('Insufficient funds')).toBeTruthy();
    });

    it('shows error screen on network failure', async () => {
      server.use(
        http.post('http://localhost:3000/api/payouts', () => HttpResponse.error())
      );
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
    });

    it('shows error screen for amount 999.99 (api 503 trigger)', async () => {
      server.resetHandlers();
      render(<PayoutsScreen />);
      fillForm('999.99', VALID_IBAN);
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
      expect(
        screen.getByText('Service temporarily unavailable. Please try again later.')
      ).toBeTruthy();
    });

    it('shows error screen for amount 888.88 (api 400 trigger)', async () => {
      server.resetHandlers();
      render(<PayoutsScreen />);
      fillForm('888.88', VALID_IBAN);
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
      expect(screen.getByText('Insufficient funds')).toBeTruthy();
    });

    it('shows error screen when the api returns status failed on 201', async () => {
      // amount 1.99 → 199 pence → 199 % 100 === 99 → status: 'failed'
      server.resetHandlers();
      render(<PayoutsScreen />);
      fillForm('1.99', VALID_IBAN);
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
      expect(
        screen.getByText('Payout could not be completed. Please try again.')
      ).toBeTruthy();
    });

    it('returns to the form with values preserved when "Try Again" is pressed', async () => {
      server.use(
        http.post('http://localhost:3000/api/payouts', () =>
          HttpResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
        )
      );
      render(<PayoutsScreen />);
      fillForm();
      fireEvent.press(screen.getByLabelText('Confirm payout'));
      await waitFor(() => expect(screen.getByText('Confirm Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Confirm and submit payout'));
      await waitFor(() => expect(screen.getByText('Unable to Process Payout')).toBeTruthy());
      fireEvent.press(screen.getByLabelText('Try again'));
      await waitFor(() => expect(screen.getByText('Send Payout')).toBeTruthy());
      expect(screen.getByLabelText('Payout amount').props.value).toBe(VALID_AMOUNT);
      expect(screen.getByLabelText('Destination IBAN').props.value).toBe(VALID_IBAN);
    });
  });
});
