import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../../src/context/IntakeContext';

export default function HistoryScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useIntake();
  const h = draft.history;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Medical History</Text>
      
      <Text style={styles.label}>Past Medical History (comma separated)</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={h.medicalHistory}
        onChangeText={(t) => updateDraft('history', 'medicalHistory', t)}
        multiline
        placeholder="Hypertension, Atrial Fibrillation..."
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Current Medications</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={h.medications}
        onChangeText={(t) => updateDraft('history', 'medications', t)}
        multiline
        placeholder="Warfarin, Lisinopril..."
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Allergies</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top', borderColor: 'rgba(239,68,68,0.3)' }]}
        value={h.allergies}
        onChangeText={(t) => updateDraft('history', 'allergies', t)}
        multiline
        placeholder="Penicillin (hives)..."
        placeholderTextColor="#64748b"
      />

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/(wizard)/vitals')}>
        <Text style={styles.nextButtonText}>Next: Vital Signs</Text>
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
