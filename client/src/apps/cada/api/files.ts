import { apiFetch } from '../../../hooks/useApiFetch';
import type { CadaFile, FileJsonData } from '../types';

export async function getJson(filename: string): Promise<FileJsonData> {
  return apiFetch<FileJsonData>(
    `/api/cada/file/json?filename=${encodeURIComponent(filename)}`
  );
}

export async function getText(filename: string): Promise<string> {
  return apiFetch<string>(
    `/api/cada/file/text?filename=${encodeURIComponent(filename)}`
  );
}

export async function createBatch(
  files: Array<{
    path: string;
    type: string;
    info: string;
    ext: string;
  }>
): Promise<CadaFile[]> {
  return apiFetch<CadaFile[]>('/api/cada/file/', {
    method: 'POST',
    body: JSON.stringify({ files }),
  });
}
