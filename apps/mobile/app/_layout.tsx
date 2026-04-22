import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IntakeProvider } from '../src/context/IntakeContext';

export default function RootLayout() {
  return (
    <IntakeProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0e1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0a0e1a' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(wizard)" options={{ headerShown: false }} />
      </Stack>
    </IntakeProvider>
  );
}
