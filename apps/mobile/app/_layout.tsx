import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0e1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0a0e1a' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'StrokeSync' }} />
        <Stack.Screen name="intake" options={{ title: 'Patient Intake' }} />
        <Stack.Screen name="vitals" options={{ title: 'Vital Signs' }} />
        <Stack.Screen name="nihss" options={{ title: 'NIHSS Assessment' }} />
      </Stack>
    </>
  );
}
