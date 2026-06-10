import { ApiError } from './apiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

type RequestOptions = {
  token?: string;
  query?: Record<string, string | undefined>;
} & Omit<RequestInit, 'body'> & {
    body?: unknown;
  };

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, query, headers, body, ...requestInit } = options;
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    ...requestInit,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.mensagem ?? 'Erro ao comunicar com a API.', response.status);
  }

  return data as T;
}
