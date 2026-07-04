/**
 * /sign-up — create an email + password account, then go to /home.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Logo } from '../src/components/Logo';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { signUp } from '../src/lib/authClient';
import { useTheme } from '../src/theme/ThemeProvider';

export default function SignUp() {
  const theme = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error: err } = await signUp.email({
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message || 'Could not create account.');
      return;
    }
    router.replace('/home');
  };

  return (
    <Screen scroll contentStyle={{ gap: theme.spacing.lg, flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        <Logo size={40} />
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Big dreams, one small step. Let's start.
        </Text>
      </View>

      <TextField
        label="Name (optional)"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder="Your name"
      />
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />

      {error && (
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>{error}</Text>
      )}

      <Button
        label="Create account"
        onPress={submit}
        loading={loading}
        disabled={!email || !password}
      />

      <View style={{ flexDirection: 'row', gap: theme.spacing.xs, justifyContent: 'center' }}>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Already have an account?
        </Text>
        <Link href="/sign-in">
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.primary }]}>Sign in</Text>
        </Link>
      </View>
    </Screen>
  );
}
