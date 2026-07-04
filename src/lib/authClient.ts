/**
 * Minimal auth client — talks to /api/auth/*. Safe for app/ and src/.
 *
 * Web: same-origin, cookies automatic. Native: EXPO_PUBLIC_API_URL (cookie
 * persistence to be added when the native client is wired). Exposes the same
 * surface the screens use: useSession(), signIn.email, signUp.email, signOut.
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const BASE = Platform.OS === 'web' ? '' : (process.env.EXPO_PUBLIC_API_URL ?? '');

export type SessionUser = { id: string; name: string | null; email: string };
type SessionState = { data: { user: SessionUser } | null; isPending: boolean };

let state: SessionState = { data: null, isPending: true };
const listeners = new Set<() => void>();
let started = false;

function emit() {
  listeners.forEach((l) => l());
}

async function refresh() {
  try {
    const res = await fetch(`${BASE}/api/auth/session`, { credentials: 'include' });
    const json = (await res.json()) as { user: SessionUser | null };
    state = { data: json.user ? { user: json.user } : null, isPending: false };
  } catch {
    state = { data: null, isPending: false };
  }
  emit();
}

export function useSession(): SessionState {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (!started) {
      started = true;
      refresh();
    }
    return () => {
      listeners.delete(l);
    };
  }, []);
  return state;
}

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string; user?: SessionUser };
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

// Set session state straight from the auth response's user, so we don't depend
// on the just-set cookie being immediately readable by a follow-up request.
function setUser(user: SessionUser | null) {
  state = { data: user ? { user } : null, isPending: false };
  emit();
}

export const signUp = {
  email: async (input: { name?: string; email: string; password: string }) => {
    try {
      const { user } = await post('/api/auth/sign-up', input);
      setUser(user ?? null);
      return { error: null as { message: string } | null };
    } catch (e) {
      return { error: { message: (e as Error).message } };
    }
  },
};

export const signIn = {
  email: async (input: { email: string; password: string }) => {
    try {
      const { user } = await post('/api/auth/sign-in', input);
      setUser(user ?? null);
      return { error: null as { message: string } | null };
    } catch (e) {
      return { error: { message: (e as Error).message } };
    }
  },
};

export async function signOut() {
  try {
    await post('/api/auth/sign-out', {});
  } catch {
    /* ignore */
  }
  setUser(null);
}
