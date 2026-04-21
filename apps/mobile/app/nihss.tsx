import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

interface NIHSSItem {
  id: string;
  label: string;
  description: string;
  maxScore: number;
  options: string[];
}

const NIHSS_ITEMS: NIHSSItem[] = [
  { id: 'loc', label: '1a. Level of Consciousness', description: 'Alertness', maxScore: 3, options: ['Alert (0)', 'Not alert, arousable (1)', 'Not alert, obtunded (2)', 'Unresponsive (3)'] },
  { id: 'locQ', label: '1b. LOC Questions', description: 'Month and age', maxScore: 2, options: ['Both correct (0)', 'One correct (1)', 'Neither correct (2)'] },
  { id: 'locC', label: '1c. LOC Commands', description: 'Open/close eyes, grip/release', maxScore: 2, options: ['Both correct (0)', 'One correct (1)', 'Neither correct (2)'] },
  { id: 'gaze', label: '2. Best Gaze', description: 'Horizontal eye movement', maxScore: 2, options: ['Normal (0)', 'Partial gaze palsy (1)', 'Forced deviation (2)'] },
  { id: 'visual', label: '3. Visual Fields', description: 'Visual field testing', maxScore: 3, options: ['No visual loss (0)', 'Partial hemianopia (1)', 'Complete hemianopia (2)', 'Bilateral hemianopia (3)'] },
  { id: 'facial', label: '4. Facial Palsy', description: 'Show teeth, raise brows', maxScore: 3, options: ['Normal (0)', 'Minor paralysis (1)', 'Partial paralysis (2)', 'Complete paralysis (3)'] },
  { id: 'motorLA', label: '5a. Motor Left Arm', description: 'Drift at 90°/45°', maxScore: 4, options: ['No drift (0)', 'Drift (1)', 'Some effort (2)', 'No effort (3)', 'No movement (4)'] },
  { id: 'motorRA', label: '5b. Motor Right Arm', description: 'Drift at 90°/45°', maxScore: 4, options: ['No drift (0)', 'Drift (1)', 'Some effort (2)', 'No effort (3)', 'No movement (4)'] },
  { id: 'motorLL', label: '6a. Motor Left Leg', description: 'Drift at 30°', maxScore: 4, options: ['No drift (0)', 'Drift (1)', 'Some effort (2)', 'No effort (3)', 'No movement (4)'] },
  { id: 'motorRL', label: '6b. Motor Right Leg', description: 'Drift at 30°', maxScore: 4, options: ['No drift (0)', 'Drift (1)', 'Some effort (2)', 'No effort (3)', 'No movement (4)'] },
  { id: 'ataxia', label: '7. Limb Ataxia', description: 'Finger-nose, heel-shin', maxScore: 2, options: ['Absent (0)', 'Present in one limb (1)', 'Present in two limbs (2)'] },
  { id: 'sensory', label: '8. Sensory', description: 'Pin prick testing', maxScore: 2, options: ['Normal (0)', 'Mild-moderate loss (1)', 'Severe or total loss (2)'] },
  { id: 'language', label: '9. Best Language', description: 'Naming, reading, describing', maxScore: 3, options: ['No aphasia (0)', 'Mild-moderate aphasia (1)', 'Severe aphasia (2)', 'Mute/global aphasia (3)'] },
  { id: 'dysarthria', label: '10. Dysarthria', description: 'Read or repeat words', maxScore: 2, options: ['Normal (0)', 'Mild-moderate (1)', 'Severe/mute (2)'] },
  { id: 'extinction', label: '11. Extinction/Inattention', description: 'Double simultaneous stimulation', maxScore: 2, options: ['No abnormality (0)', 'One modality (1)', 'Profound (2)'] },
];

export default function NIHSSScreen() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);

  const getSeverityColor = (score: number) => {
    if (score === 0) return '#22c55e';
    if (score <= 4) return '#84cc16';
    if (score <= 15) return '#f59e0b';
    if (score <= 20) return '#f97316';
    return '#ef4444';
  };

  const getSeverityLabel = (score: number) => {
    if (score === 0) return 'No Stroke Symptoms';
    if (score <= 4) return 'Minor Stroke';
    if (score <= 15) return 'Moderate Stroke';
    if (score <= 20) return 'Moderate-Severe Stroke';
    return 'Severe Stroke';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Score Header */}
      <View style={styles.scoreHeader}>
        <Text style={[styles.totalScore, { color: getSeverityColor(totalScore) }]}>
          {totalScore}
        </Text>
        <Text style={[styles.severityLabel, { color: getSeverityColor(totalScore) }]}>
          {getSeverityLabel(totalScore)}
        </Text>
        <Text style={styles.maxScore}>/ 42 max</Text>
      </View>

      {/* NIHSS Items */}
      {NIHSS_ITEMS.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
          <View style={styles.optionsRow}>
            {item.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, scores[item.id] === i && styles.optionSelected]}
                onPress={() => setScores((prev) => ({ ...prev, [item.id]: i }))}
              >
                <Text style={[styles.optionText, scores[item.id] === i && styles.optionTextSelected]}>
                  {i}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>Save & Transmit NIHSS (Score: {totalScore})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  content: { padding: 20, paddingBottom: 40 },
  scoreHeader: { alignItems: 'center', marginBottom: 24, padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  totalScore: { fontSize: 64, fontWeight: '900' },
  severityLabel: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  maxScore: { fontSize: 14, color: '#4a5568', marginTop: 2 },
  itemCard: { marginBottom: 12, padding: 16, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  itemLabel: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  itemDesc: { fontSize: 12, color: '#8892b0', marginTop: 2, marginBottom: 10 },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  optionSelected: { backgroundColor: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6' },
  optionText: { fontSize: 16, fontWeight: '700', color: '#8892b0' },
  optionTextSelected: { color: '#3b82f6' },
  submitBtn: { marginTop: 12, backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
