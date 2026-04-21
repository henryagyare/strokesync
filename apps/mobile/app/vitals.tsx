import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function VitalsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Record Vital Signs</Text>
      <Text style={styles.subtitle}>Patient: John Doe — 65M</Text>

      {/* Blood Pressure */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>🩸 Blood Pressure</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Systolic</Text>
            <TextInput style={styles.input} placeholder="120" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.divider}>/</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Diastolic</Text>
            <TextInput style={styles.input} placeholder="80" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.unit}>mmHg</Text>
        </View>
      </View>

      {/* Heart Rate */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>💓 Heart Rate</Text>
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <TextInput style={styles.input} placeholder="72" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.unit}>bpm</Text>
        </View>
      </View>

      {/* O2 Saturation */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>🫁 O₂ Saturation</Text>
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <TextInput style={styles.input} placeholder="98" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.unit}>%</Text>
        </View>
      </View>

      {/* Respiratory Rate */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>💨 Respiratory Rate</Text>
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <TextInput style={styles.input} placeholder="16" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.unit}>/min</Text>
        </View>
      </View>

      {/* Temperature */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>🌡️ Temperature</Text>
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <TextInput style={styles.input} placeholder="37.0" placeholderTextColor="#4a5568" keyboardType="decimal-pad" />
          </View>
          <Text style={styles.unit}>°C</Text>
        </View>
      </View>

      {/* Blood Glucose */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>🩸 Blood Glucose</Text>
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <TextInput style={styles.input} placeholder="100" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.unit}>mg/dL</Text>
        </View>
      </View>

      {/* GCS */}
      <View style={styles.vitalSection}>
        <Text style={styles.vitalLabel}>🧠 GCS Score</Text>
        <View style={styles.row}>
          <View style={[styles.field, { flex: 2 }]}>
            <TextInput style={styles.input} placeholder="15" placeholderTextColor="#4a5568" keyboardType="numeric" />
          </View>
          <Text style={styles.unit}>/15</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>Save & Transmit Vitals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#8892b0', marginBottom: 24 },
  vitalSection: { marginBottom: 20, padding: 16, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  vitalLabel: { fontSize: 15, fontWeight: '700', color: '#ffffff', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  field: { flex: 1 },
  fieldLabel: { fontSize: 11, color: '#8892b0', marginBottom: 4, fontWeight: '600' },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#ffffff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  divider: { color: '#8892b0', fontSize: 24, fontWeight: '300' },
  unit: { color: '#8892b0', fontSize: 14, fontWeight: '600', minWidth: 45 },
  submitBtn: { marginTop: 8, backgroundColor: '#22c55e', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
