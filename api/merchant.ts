import { API_BASE_URL } from '@/constants';
import type { MerchantDataResponse, PaginatedActivityResponse } from '@/types/api';

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
