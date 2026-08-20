import { apiFetch } from '../../../hooks/useApiFetch';
import type { IveTag, IveUserRef } from './types';

const BASE = '/api/ive/endpoint';

export interface SavedEndpoint {
  id?: number;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: {
    body?: Record<string, unknown>;
    attributes?: string[];
    countOnly?: boolean;
  };
  description?: string;
  /** Legacy free-form tags stored as a JSON blob on the row. Prefer iveTags. */
  tags?: string[];
  /** Tags from the iveTag join table (slug-only). */
  iveTags?: IveTag[];
  isPublic?: boolean;
  isCached?: boolean;
  createdBy?: IveUserRef;
  createdAt?: string;
  updatedAt?: string;
}

/* ─────── CRUD ─────── */

export function listEndpointsByUser(userId: number | string): Promise<SavedEndpoint[]> {
  return apiFetch<SavedEndpoint[]>(`${BASE}/users/${userId}`);
}

/** All endpoints visible to the caller: owned by them OR public. */
export function listVisibleEndpoints(): Promise<SavedEndpoint[]> {
  return apiFetch<SavedEndpoint[]>(BASE);
}

export function getEndpointById(id: number | string): Promise<SavedEndpoint> {
  return apiFetch<SavedEndpoint>(`${BASE}/${id}`);
}

/** Filter endpoints by tag slug via the iveTag join table. */
export function listEndpointsByTagSlug(slug: string): Promise<SavedEndpoint[]> {
  return apiFetch<SavedEndpoint[]>(`${BASE}?tag=${encodeURIComponent(slug)}`);
}

/** Legacy: filter via the JSON-blob `tags` column. Prefer listEndpointsByTagSlug. */
export function listEndpointsByLegacyTag(tagName: string): Promise<SavedEndpoint[]> {
  return apiFetch<SavedEndpoint[]>(`${BASE}/tags/${encodeURIComponent(tagName)}`);
}

export function createEndpoint(
  data: Omit<SavedEndpoint, 'id' | 'createdBy' | 'iveTags' | 'createdAt' | 'updatedAt'>
): Promise<SavedEndpoint> {
  return apiFetch<SavedEndpoint>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateEndpoint(id: number | string, data: Partial<SavedEndpoint>): Promise<SavedEndpoint> {
  return apiFetch<SavedEndpoint>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteEndpoint(id: number | string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' });
}

/* ─────── Tags ─────── */

export function attachEndpointTags(id: number | string, slugs: string[]): Promise<SavedEndpoint> {
  return apiFetch<SavedEndpoint>(`${BASE}/${id}/tags`, {
    method: 'POST',
    body: JSON.stringify({ slugs }),
  });
}

export function setEndpointTags(id: number | string, slugs: string[]): Promise<SavedEndpoint> {
  return apiFetch<SavedEndpoint>(`${BASE}/${id}/tags`, {
    method: 'PUT',
    body: JSON.stringify({ slugs }),
  });
}

export function detachEndpointTag(id: number | string, tagId: number | string): Promise<SavedEndpoint> {
  return apiFetch<SavedEndpoint>(`${BASE}/${id}/tags/${tagId}`, { method: 'DELETE' });
}

