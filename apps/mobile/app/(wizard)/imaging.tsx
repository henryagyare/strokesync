import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../../src/context/IntakeContext';

export default function ImagingScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useIntake();
  const img = draft.imaging;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Portable CT Scanner</Text>
      
      <Text style={styles.label}>Imaging Type</Text>
      <TextInput style={styles.input} value={img.type} onChangeText={(t) => updateDraft('imaging', 'type', t)} placeholderTextColor="#64748b" />

      <Text style={styles.label}>ASPECTS Score (0-10)</Text>
      <TextInput style={styles.input} value={img.aspects} onChangeText={(t) => updateDraft('imaging', 'aspects', t)} keyboardType="numeric" placeholder="10" placeholderTextColor="#64748b" />

      <Text style={styles.label}>Technician Impression</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={img.impression}
        onChangeText={(t) => updateDraft('imaging', 'impression', t)}
        multiline
        placeholder="No acute hemorrhage..."
        placeholderTextColor="#64748b"
      />

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/(wizard)/nihss')}>
        <Text style={styles.nextButtonText}>Next: NIHSS Score</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 16, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: 14, fontSize: 16 },
  nextButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
