/**
 * Auth gate — the entry route. Sends signed-in users to /home, everyone else to
 * /sign-in. Shows a themed splash while the session resolves.
 */

import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '../src/lib/authClient';
import { useTheme } from '../src/theme/ThemeProvider';

export default function Index() {
  const { data, isPending } = useSession();
  const theme = useTheme();

  if (isPending) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  return <Redirect href={data ? '/home' : '/sign-in'} />;
}
