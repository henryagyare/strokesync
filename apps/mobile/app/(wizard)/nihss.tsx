import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIntake } from '../../src/context/IntakeContext';

const NIHSS_QUESTIONS = [
  { k: 'levelOfConsciousness', l: '1a. Level of Consciousness' },
  { k: 'locQuestions', l: '1b. LOC Questions' },
  { k: 'locCommands', l: '1c. LOC Commands' },
  { k: 'bestGaze', l: '2. Best Gaze' },
  { k: 'visualFields', l: '3. Visual Fields' },
  { k: 'facialPalsy', l: '4. Facial Palsy' },
  { k: 'motorLeftArm', l: '5a. Motor Left Arm' },
  { k: 'motorRightArm', l: '5b. Motor Right Arm' },
  { k: 'motorLeftLeg', l: '6a. Motor Left Leg' },
  { k: 'motorRightLeg', l: '6b. Motor Right Leg' },
  { k: 'limbAtaxia', l: '7. Limb Ataxia' },
  { k: 'sensory', l: '8. Sensory' },
  { k: 'bestLanguage', l: '9. Best Language' },
  { k: 'dysarthria', l: '10. Dysarthria' },
  { k: 'extinctionInattention', l: '11. Extinction/Inattention' },
];

export default function NIHSSScreen() {
  const router = useRouter();
  const { draft, updateDraft, calculateTotalNIHSS } = useIntake();
  const total = calculateTotalNIHSS();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.scoreBanner}>
        <Text style={styles.scoreLabel}>TOTAL NIHSS SCORE</Text>
        <Text style={styles.scoreText}>{total}</Text>
      </View>
      
      {NIHSS_QUESTIONS.map((q) => (
        <View key={q.k} style={styles.row}>
          <Text style={styles.label}>{q.l}</Text>
          <TextInput
            style={styles.input}
            value={(draft.nihss as any)[q.k]}
            onChangeText={(t) => updateDraft('nihss', q.k, t)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        </View>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/(wizard)/transmit')}>
        <Text style={styles.nextButtonText}>Next: Transmit & Alert</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 100 },
  scoreBanner: { backgroundColor: '#1e293b', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  scoreLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  scoreText: { color: '#ef4444', fontSize: 48, fontWeight: '900', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  label: { color: '#fff', fontSize: 16, fontWeight: '500', flex: 1, marginRight: 16 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: '#3b82f6', borderRadius: 12, color: '#fff', padding: 12, fontSize: 20, fontWeight: 'bold', textAlign: 'center', width: 60 },
  nextButton: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
