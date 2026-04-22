import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../../src/context/IntakeContext';

export default function LabsScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useIntake();
  const l = draft.labs;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Point of Care Labs</Text>
      
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Glucose (mg/dL)</Text>
          <TextInput style={styles.input} value={l.glucose} onChangeText={(t) => updateDraft('labs', 'glucose', t)} keyboardType="numeric" placeholder="95" placeholderTextColor="#64748b" />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>INR</Text>
          <TextInput style={styles.input} value={l.inr} onChangeText={(t) => updateDraft('labs', 'inr', t)} keyboardType="numeric" placeholder="1.0" placeholderTextColor="#64748b" />
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/(wizard)/imaging')}>
        <Text style={styles.nextButtonText}>Next: Imaging</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: 14, fontSize: 16 },
  nextButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
