/**
 * Thin fetch wrapper for the /api/* backend.
 *
 * Web: relative URLs, cookies sent automatically. Native: absolute base from
 * EXPO_PUBLIC_API_URL. Throws on non-2xx with the response body.
 */

import { Platform } from 'react-native';

const BASE = Platform.OS === 'web' ? '' : (process.env.EXPO_PUBLIC_API_URL ?? '');

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(BASE + path, { ...init, headers, credentials: 'include' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = `${res.status} ${res.statusText}`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      if (text) message += `: ${text}`;
    }
    throw new Error(message);
  }
  return res;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  return (await res.json()) as T;
}
