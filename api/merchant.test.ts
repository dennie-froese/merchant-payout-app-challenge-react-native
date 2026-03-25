import { http, HttpResponse } from 'msw';
import { fetchMerchant, fetchActivity } from './merchant';
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
