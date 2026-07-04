/**
 * Better Auth client — safe to import from app/ and src/ (no server/Prisma code).
 *
 * Web: talks to the same origin (cookies just work). Native: points at the
 * deployed API via EXPO_PUBLIC_API_URL and stores the session in SecureStore.
 */

import { Platform } from 'react-native';
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

const webOrigin =
  Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : undefined;

export const authClient = createAuthClient({
  baseURL: Platform.OS === 'web' ? webOrigin : process.env.EXPO_PUBLIC_API_URL,
  plugins:
    Platform.OS === 'web'
      ? []
      : [
          expoClient({
            scheme: 'saku',
            storagePrefix: 'saku',
            storage: SecureStore,
          }),
        ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
