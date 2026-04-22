import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useIntake } from '../../src/context/IntakeContext';

export default function TransmitScreen() {
  const router = useRouter();
  const { draft, resetDraft, calculateTotalNIHSS } = useIntake();
  const [transmitting, setTransmitting] = useState(false);
  const totalNihss = calculateTotalNIHSS();

  const handleTransmit = async () => {
    // Validate minimal fields
    if (!draft.demographics.firstName) {
      Alert.alert('Error', 'Patient First Name is required.');
      return;
    }

    setTransmitting(true);

    try {
      // Step 1: Create Patient
      const patientRes = await fetch('http://192.168.1.100:4000/api/v1/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: draft.demographics.firstName,
          lastName: draft.demographics.lastName || 'Unknown',
          dateOfBirth: draft.demographics.dob ? new Date(draft.demographics.dob) : undefined,
          gender: draft.demographics.gender || 'UNKNOWN',
          mrn: draft.demographics.mrn || undefined,
          chiefComplaint: draft.demographics.chiefComplaint,
          symptomOnsetTime: draft.demographics.symptomOnsetTime ? new Date() : undefined, // simplify for demo
          medicalHistory: draft.history.medicalHistory ? [draft.history.medicalHistory] : [],
        }),
      });
      if (!patientRes.ok) throw new Error('Failed to create patient');
      const patient = await patientRes.json();

      // Step 2: Create Encounter
      const encRes = await fetch('http://192.168.1.100:4000/api/v1/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          technicianId: '33333333-3333-3333-3333-333333333333', // Fake Tech ID or extract from local auth
          dispatchUnit: 'MSU-01',
          dispatchLocation: 'Field',
        }),
      });
      const encounter = await encRes.json();

      // Step 3: Transmit & Alert (The one-tap magic endpoint)
      const transmitRes = await fetch('http://192.168.1.100:4000/api/v1/alerts/transmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId: encounter.id,
          patientId: patient.id,
          technicianId: '33333333-3333-3333-3333-333333333333',
        }),
      });

      if (!transmitRes.ok) throw new Error('Failed to alert neurologist');

      Alert.alert('Transmitted', 'Neurologist alerted and data synced!', [
        { text: 'OK', onPress: async () => {
          await resetDraft();
          router.replace('/');
        }}
      ]);
    } catch (e: any) {
      Alert.alert('Transmission Failed', e.message + '\nDraft is saved offline.');
    } finally {
      setTransmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.title}>Data Ready to Transmit</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Patient:</Text>
          <Text style={styles.statVal}>{draft.demographics.firstName} {draft.demographics.lastName}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>NIHSS:</Text>
          <Text style={[styles.statVal, { color: '#ef4444' }]}>{totalNihss}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>BP:</Text>
          <Text style={styles.statVal}>{draft.vitals.systolicBP || '--'}/{draft.vitals.diastolicBP || '--'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Imaging:</Text>
          <Text style={styles.statVal}>{draft.imaging.type ? 'Scanned' : 'Pending'}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.txButton, transmitting && { opacity: 0.7 }]} 
        onPress={handleTransmit}
        disabled={transmitting}
      >
        <Text style={styles.txText}>
          {transmitting ? 'Transmitting...' : '🚨 One-Tap Transmit & Alert 🚨'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.footText}>If offline, data is securely cached and will transmit immediately upon connection.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20 },
  summaryCard: { backgroundColor: '#1e293b', padding: 24, borderRadius: 16, marginBottom: 32, borderWidth: 1, borderColor: '#334155' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statLabel: { color: '#94a3b8', fontSize: 16 },
  statVal: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  txButton: { backgroundColor: '#ef4444', paddingVertical: 24, borderRadius: 16, alignItems: 'center', shadowColor: '#ef4444', shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  txText: { color: '#fff', fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  footText: { color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 24, paddingHorizontal: 20 },
});
