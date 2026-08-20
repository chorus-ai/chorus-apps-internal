import { apiFetch } from '../../../hooks/useApiFetch';
import type { BucketData } from '../types';

export async function get(path: string): Promise<BucketData> {
  return apiFetch(`/api/bucket/${path}`);
}
