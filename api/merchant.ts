import { API_BASE_URL } from '@/constants';
import type { MerchantDataResponse, PaginatedActivityResponse, CreatePayoutRequest, PayoutResponse } from '@/types/api';

export async function fetchMerchant(): Promise<MerchantDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/merchant`);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

export async function fetchActivity(cursor?: string | null): Promise<PaginatedActivityResponse> {
  const params = new URLSearchParams({ limit: '15' });
  if (cursor) params.set('cursor', cursor);
  const response = await fetch(`${API_BASE_URL}/api/merchant/activity?${params}`);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

export async function submitPayout(payload: CreatePayoutRequest): Promise<PayoutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let message = 'Something went wrong';
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch { /* ignore */ }
    if (response.status >= 500) message = `${message}. Please try again later.`;
    throw new Error(message);
  }
  const data: PayoutResponse = await response.json();
  if (data.status === 'failed') {
    throw new Error('Payout could not be completed. Please try again.');
  }
  return data;
}
