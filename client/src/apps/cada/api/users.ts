import { apiFetch } from '../../../hooks/useApiFetch';
import type { User } from '../types';

export interface UserSearchPayload {
  fid?: number;
  attributes?: string[];
  status?: string;
  exUids?: number[];
  searchString?: string;
  limit?: number;
}

export interface UserAddPayload {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  loginType?: string;
  password?: string;
  role?: string;
  isBot?: boolean;
}

export async function search(payload: UserSearchPayload): Promise<User[]> {
  return apiFetch<User[]>('/api/user/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function add(payload: UserAddPayload): Promise<User> {
  return apiFetch<User>('/api/feature/1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function update(userId: number, payload: Partial<UserAddPayload>): Promise<User> {
  return apiFetch<User>(`/api/feature/1/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function remove(userId: number): Promise<void> {
  await apiFetch<void>(`/api/feature/1/users/${userId}`, {
    method: 'DELETE',
  });
}
