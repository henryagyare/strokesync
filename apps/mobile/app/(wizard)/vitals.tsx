import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../../src/context/IntakeContext';

export default function VitalsScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useIntake();
  const v = draft.vitals;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.btBanner}>
        <Text style={styles.btText}>📡 Tap to connect Bluetooth Monitor</Text>
      </View>

      <Text style={styles.sectionTitle}>Vital Signs</Text>
      
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Systolic BP</Text>
          <TextInput style={styles.input} value={v.systolicBP} onChangeText={(t) => updateDraft('vitals', 'systolicBP', t)} keyboardType="numeric" placeholder="120" placeholderTextColor="#64748b" />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Diastolic BP</Text>
          <TextInput style={styles.input} value={v.diastolicBP} onChangeText={(t) => updateDraft('vitals', 'diastolicBP', t)} keyboardType="numeric" placeholder="80" placeholderTextColor="#64748b" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Heart Rate (bpm)</Text>
          <TextInput style={styles.input} value={v.heartRate} onChangeText={(t) => updateDraft('vitals', 'heartRate', t)} keyboardType="numeric" placeholder="75" placeholderTextColor="#64748b" />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>SpO2 (%)</Text>
          <TextInput style={styles.input} value={v.oxygenSaturation} onChangeText={(t) => updateDraft('vitals', 'oxygenSaturation', t)} keyboardType="numeric" placeholder="98" placeholderTextColor="#64748b" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>GCS Score (3-15)</Text>
          <TextInput style={styles.input} value={v.gcsScore} onChangeText={(t) => updateDraft('vitals', 'gcsScore', t)} keyboardType="numeric" placeholder="15" placeholderTextColor="#64748b" />
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/(wizard)/labs')}>
        <Text style={styles.nextButtonText}>Next: POC Labs</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 100 },
  btBanner: { backgroundColor: '#1e3a8a', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#3b82f6' },
  btText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: 14, fontSize: 16 },
  nextButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
