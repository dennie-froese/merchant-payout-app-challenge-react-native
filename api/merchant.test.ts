import { http, HttpResponse } from 'msw';
import { fetchMerchant, fetchActivity, submitPayout } from './merchant';
import { server } from '../mocks/server.test';

describe('fetchMerchant', () => {
  it('returns merchant data with the expected shape', async () => {
    const data = await fetchMerchant();
    expect(typeof data.available_balance).toBe('number');
    expect(typeof data.pending_balance).toBe('number');
    expect(['GBP', 'EUR']).toContain(data.currency);
    expect(Array.isArray(data.activity)).toBe(true);
  });

  it('throws on a non-ok response', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    await expect(fetchMerchant()).rejects.toThrow('Request failed with status 500');
  });
});

describe('fetchActivity', () => {
  it('returns paginated activity with the expected shape', async () => {
    const data = await fetchActivity();
    expect(Array.isArray(data.items)).toBe(true);
    expect(typeof data.has_more).toBe('boolean');
    // next_cursor is either a string or null
    expect(data.next_cursor === null || typeof data.next_cursor === 'string').toBe(true);
  });

  it('includes items with the expected fields', async () => {
    const data = await fetchActivity();
    const item = data.items[0];
    expect(typeof item.id).toBe('string');
    expect(typeof item.amount).toBe('number');
    expect(typeof item.description).toBe('string');
    expect(typeof item.date).toBe('string');
  });

  it('sends the cursor as a query parameter', async () => {
    let capturedUrl = '';
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({ items: [], next_cursor: null, has_more: false });
      })
    );
    await fetchActivity('act_005');
    expect(capturedUrl).toContain('cursor=act_005');
  });

  it('throws on a non-ok response', async () => {
    server.use(
      http.get('http://localhost:3000/api/merchant/activity', () =>
        HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      )
    );
    await expect(fetchActivity()).rejects.toThrow('Request failed with status 500');
  });
});

describe('submitPayout', () => {
  const payload = { amount: 40000, currency: 'GBP' as const, iban: 'GB29NWBK60161331926819' };

  it('returns the payout response on success', async () => {
    const result = await submitPayout(payload);
    expect(result.status).toBe('completed');
    expect(result.amount).toBe(40000);
  });

  it('throws with the api error message on 503', async () => {
    // trigger amount: 99999 pence (999.99)
    await expect(
      submitPayout({ ...payload, amount: 99999 })
    ).rejects.toThrow('Service temporarily unavailable. Please try again later.');
  });

  it('throws with the api error message on 400', async () => {
    // trigger amount: 88888 pence (888.88)
    await expect(
      submitPayout({ ...payload, amount: 88888 })
    ).rejects.toThrow('Insufficient funds');
  });

  it('throws when the response status is failed', async () => {
    // trigger: amount % 100 === 99, e.g. 199 pence (1.99)
    await expect(
      submitPayout({ ...payload, amount: 199 })
    ).rejects.toThrow('Payout could not be completed. Please try again.');
  });

  it('throws on a network error', async () => {
    server.use(
      http.post('http://localhost:3000/api/payouts', () => HttpResponse.error())
    );
    await expect(submitPayout(payload)).rejects.toThrow();
  });
});
