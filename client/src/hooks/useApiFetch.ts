export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    const path = window.location.pathname;
    if (
      !url.includes('/auth/me') &&
      !path.startsWith('/signin') &&
      !path.startsWith('/signup') &&
      !path.startsWith('/resetpassword')
    ) {
      window.location.href = '/signin';
    }
    throw new ApiError('Unauthorized', 401);
  }

  if (!res.ok) {
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = await res.text();
    }
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: string }).message)
        : res.statusText;
    throw new ApiError(message, res.status, data);
  }

  const text = await res.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
