import { apiFetch } from '../../../hooks/useApiFetch';
import type { ImpersonateResponse } from '../types';

export async function logout(): Promise<void> {
  await apiFetch<void>('/api/auth/logout', { method: 'POST' });
}

export async function impersonate(
  userId: number
): Promise<ImpersonateResponse> {
  return apiFetch<ImpersonateResponse>('/api/auth/impersonate', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}
