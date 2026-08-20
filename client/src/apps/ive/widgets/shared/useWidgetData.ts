import { useEffect, useState } from 'react';
import { apiFetch } from '../../../../hooks/useApiFetch';
import type { EndpointConfig } from './settingsShared';

/**
 * Resolves a widget's data according to its EndpointConfig:
 * - source 'static' (default): returns `fallback` (the widget's built-in data)
 * - source 'endpoint': fetches the configured endpoint, falling back to
 *   `fallback` while loading or on error so the widget always renders.
 */
export function useWidgetData<T>(config: EndpointConfig | undefined, fallback: T) {
  const source = config?.source ?? 'static';
  const endpoint = config?.endpoint;
  const method = config?.method ?? 'GET';
  const body = config?.body;

  const [remote, setRemote] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRemote(null);
    setError(null);
    if (source !== 'endpoint' || !endpoint) return;
    let cancelled = false;
    setLoading(true);
    apiFetch<T>(endpoint, method === 'POST' ? { method: 'POST', body } : undefined)
      .then((data) => { if (!cancelled) setRemote(data); })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Request failed');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [source, endpoint, method, body]);

  return { data: remote ?? fallback, loading, error, isRemote: remote !== null };
}
