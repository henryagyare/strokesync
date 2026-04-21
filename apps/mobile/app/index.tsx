import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🧠 StrokeSync</Text>
        <Text style={styles.subtitle}>Mobile Stroke Unit Technician Console</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Connected</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.card, styles.cardPrimary]}
            onPress={() => router.push('/intake')}
          >
            <Text style={styles.cardIcon}>➕</Text>
            <Text style={styles.cardTitle}>New Patient</Text>
            <Text style={styles.cardDesc}>Start intake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardSecondary]}
            onPress={() => router.push('/vitals')}
          >
            <Text style={styles.cardIcon}>💓</Text>
            <Text style={styles.cardTitle}>Record Vitals</Text>
            <Text style={styles.cardDesc}>BP, HR, O₂</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardSecondary]}
            onPress={() => router.push('/nihss')}
          >
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>NIHSS Score</Text>
            <Text style={styles.cardDesc}>Assessment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.cardSecondary]}>
            <Text style={styles.cardIcon}>📷</Text>
            <Text style={styles.cardTitle}>Upload CT</Text>
            <Text style={styles.cardDesc}>Imaging</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Patients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Patients</Text>
        {[
          { name: 'John Doe', age: '65M', status: 'CRITICAL', nihss: 18 },
          { name: 'Jane Smith', age: '50F', status: 'HIGH', nihss: 6 },
          { name: 'Bob Johnson', age: '70M', status: 'CRITICAL', nihss: 22 },
          { name: 'Maria Rodriguez', age: '40F', status: 'HIGH', nihss: 4 },
        ].map((p, i) => (
          <TouchableOpacity key={i} style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <Text style={styles.patientName}>{p.name}</Text>
              <Text style={styles.patientAge}>{p.age}</Text>
            </View>
            <View style={styles.patientFooter}>
              <View style={[
                styles.priorityBadge,
                p.status === 'CRITICAL' ? styles.priorityCritical : styles.priorityHigh,
              ]}>
                <Text style={[
                  styles.priorityText,
                  p.status === 'CRITICAL' ? styles.priorityTextCritical : styles.priorityTextHigh,
                ]}>
                  {p.status}
                </Text>
              </View>
              <Text style={[
                styles.nihssText,
                p.nihss >= 16 ? styles.nihssCritical : p.nihss >= 5 ? styles.nihssModerate : styles.nihssMild,
              ]}>
                NIHSS: {p.nihss}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 40 },
  
  header: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  logo: { fontSize: 32, fontWeight: '800', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#8892b0', marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6 },
  statusText: { fontSize: 12, color: '#22c55e', fontWeight: '600' },
  
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 16 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47.5%', padding: 20, borderRadius: 16, borderWidth: 1 },
  cardPrimary: { backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' },
  cardSecondary: { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
  cardDesc: { fontSize: 12, color: '#8892b0', marginTop: 2 },
  
  patientCard: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 8 },
  patientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  patientAge: { fontSize: 13, color: '#8892b0' },
  patientFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityCritical: { backgroundColor: 'rgba(239,68,68,0.1)' },
  priorityHigh: { backgroundColor: 'rgba(245,158,11,0.1)' },
  priorityText: { fontSize: 11, fontWeight: '700' },
  priorityTextCritical: { color: '#ef4444' },
  priorityTextHigh: { color: '#f59e0b' },
  nihssText: { fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  nihssCritical: { color: '#ef4444' },
  nihssModerate: { color: '#f59e0b' },
  nihssMild: { color: '#22c55e' },
});
