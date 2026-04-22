import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../../src/context/IntakeContext';

export default function DemographicsScreen() {
  const router = useRouter();
  const { draft, updateDraft } = useIntake();
  const d = draft.demographics;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Patient Demographics</Text>
      
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value={d.firstName} onChangeText={(t) => updateDraft('demographics', 'firstName', t)} placeholderTextColor="#64748b" />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={d.lastName} onChangeText={(t) => updateDraft('demographics', 'lastName', t)} placeholderTextColor="#64748b" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
          <TextInput style={styles.input} value={d.dob} onChangeText={(t) => updateDraft('demographics', 'dob', t)} keyboardType="numeric" placeholder="1960-01-01" placeholderTextColor="#64748b" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Clinical Presentation</Text>
      
      <Text style={styles.label}>Chief Complaint</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        value={d.chiefComplaint}
        onChangeText={(t) => updateDraft('demographics', 'chiefComplaint', t)}
        multiline
        placeholder="e.g. Sudden left-sided weakness"
        placeholderTextColor="#64748b"
      />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Time of Onset</Text>
          <TextInput style={styles.input} value={d.symptomOnsetTime} onChangeText={(t) => updateDraft('demographics', 'symptomOnsetTime', t)} placeholder="e.g. 2h ago" placeholderTextColor="#64748b" />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Last Known Well</Text>
          <TextInput style={styles.input} value={d.lastKnownWellTime} onChangeText={(t) => updateDraft('demographics', 'lastKnownWellTime', t)} placeholder="e.g. 3h ago" placeholderTextColor="#64748b" />
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/(wizard)/history')}>
        <Text style={styles.nextButtonText}>Next: Medical History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', padding: 14, fontSize: 16 },
  nextButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
