import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../src/context/IntakeContext';
import { socketService } from '../src/lib/socket';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { resetDraft, draft } = useIntake();

  useEffect(() => {
    // Optionally connect to socket just to receive global push notifications or alerts
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  const handleStartNew = async () => {
    await resetDraft();
    router.push('/(wizard)/demographics');
  };

  const handleResume = () => {
    router.push('/(wizard)/demographics');
  };

  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.title}>StrokeSync</Text>
        <Text style={styles.subtitle}>Mobile Stroke Unit</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleStartNew}>
          <Text style={styles.primaryButtonText}>➕ Start New Patient</Text>
        </TouchableOpacity>

        {draft && draft.demographics.firstName && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handleResume}>
            <Text style={styles.secondaryButtonText}>
              🔄 Resume: {draft.demographics.firstName} {draft.demographics.lastName}
            </Text>
            <Text style={styles.draftSubtext}>Unsynced Draft</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 60 },
  logoCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#3b82f6', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  logoText: { color: '#fff', fontSize: 40, fontWeight: '900' },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: '#8b95a8', fontSize: 16, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  content: { gap: 16 },
  primaryButton: { backgroundColor: '#ef4444', paddingVertical: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#ef4444', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  secondaryButton: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  secondaryButtonText: { color: '#cbd5e1', fontSize: 16, fontWeight: '600' },
  draftSubtext: { color: '#ef4444', fontSize: 12, fontWeight: '700', marginTop: 4 },
});
