/**
 * Thin fetch wrapper for the /api/* backend.
 *
 * Web: relative URLs, cookies sent automatically. Native: absolute base from
 * EXPO_PUBLIC_API_URL, with the Better Auth session cookie attached from
 * SecureStore. Throws on non-2xx with the response body for easier debugging.
 */

import { Platform } from 'react-native';
import { authClient } from './authClient';

const BASE = Platform.OS === 'web' ? '' : (process.env.EXPO_PUBLIC_API_URL ?? '');

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (Platform.OS !== 'web') {
    // Expo client stores the session cookie; attach it on native requests.
    const cookie = (authClient as unknown as { getCookie?: () => string }).getCookie?.();
    if (cookie) headers.set('Cookie', cookie);
  }
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(BASE + path, { ...init, headers, credentials: 'include' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
  }
  return res;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  return (await res.json()) as T;
}
