/**
 * /sign-in — email + password. On success, Better Auth sets the session and we
 * route to /home.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Logo } from '../src/components/Logo';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { signIn } from '../src/lib/authClient';
import { useTheme } from '../src/theme/ThemeProvider';

export default function SignIn() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await signIn.email({ email: email.trim(), password });
    setLoading(false);
    if (err) {
      setError(err.message || 'Could not sign in.');
      return;
    }
    router.replace('/home');
  };

  return (
    <Screen scroll contentStyle={{ gap: theme.spacing.lg, flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        <Logo size={40} />
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          One thing at a time. Welcome back.
        </Text>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        placeholder="••••••••"
      />

      {error && (
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>{error}</Text>
      )}

      <Button
        label="Sign in"
        onPress={submit}
        loading={loading}
        disabled={!email || !password}
      />

      <View style={{ flexDirection: 'row', gap: theme.spacing.xs, justifyContent: 'center' }}>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>New here?</Text>
        <Link href="/sign-up">
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.primary }]}>
            Create an account
          </Text>
        </Link>
      </View>
    </Screen>
  );
}
