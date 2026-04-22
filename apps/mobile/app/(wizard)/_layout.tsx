import { Tabs } from 'expo-router';

export default function WizardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: '#0a0e1a', borderTopColor: 'rgba(255,255,255,0.1)', height: 60, paddingBottom: 8 },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        sceneStyle: { backgroundColor: '#0a0e1a' },
      }}
    >
      <Tabs.Screen name="demographics" options={{ title: 'Pt Info', tabBarIcon: () => null }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: () => null }} />
      <Tabs.Screen name="vitals" options={{ title: 'Vitals', tabBarIcon: () => null }} />
      <Tabs.Screen name="labs" options={{ title: 'Labs', tabBarIcon: () => null }} />
      <Tabs.Screen name="imaging" options={{ title: 'Imaging', tabBarIcon: () => null }} />
      <Tabs.Screen name="nihss" options={{ title: 'NIHSS', tabBarIcon: () => null }} />
      <Tabs.Screen name="transmit" options={{ title: 'Transmit', tabBarIcon: () => null }} />
    </Tabs>
  );
}
