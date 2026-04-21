import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function IntakeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Patient Demographics</Text>

      {/* Name Section */}
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput style={styles.input} placeholder="John" placeholderTextColor="#4a5568" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput style={styles.input} placeholder="Doe" placeholderTextColor="#4a5568" />
        </View>
      </View>

      {/* DOB & Gender */}
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth *</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#4a5568" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.genderRow}>
            {['M', 'F', 'O'].map((g) => (
              <TouchableOpacity key={g} style={styles.genderBtn}>
                <Text style={styles.genderText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.field}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="+1-555-0000" placeholderTextColor="#4a5568" keyboardType="phone-pad" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="Street address" placeholderTextColor="#4a5568" />
      </View>

      {/* Emergency Contact */}
      <Text style={[styles.title, { marginTop: 24 }]}>Emergency Contact</Text>
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} placeholder="Contact name" placeholderTextColor="#4a5568" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#4a5568" keyboardType="phone-pad" />
        </View>
      </View>

      {/* Chief Complaint */}
      <Text style={[styles.title, { marginTop: 24 }]}>Chief Complaint</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Complaint *</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Describe symptoms..."
          placeholderTextColor="#4a5568"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Symptom Onset Time</Text>
        <TextInput style={styles.input} placeholder="HH:MM (24h)" placeholderTextColor="#4a5568" />
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>Create Patient & Start Encounter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  field: { flex: 1, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#8892b0', marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#ffffff', fontSize: 15 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  genderText: { color: '#ffffff', fontWeight: '600' },
  submitBtn: { marginTop: 8, backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
