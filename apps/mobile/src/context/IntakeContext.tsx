import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '@strokesync/shared';

// Shape of the entire offline intake form
export interface IntakeState {
  id: string; // Draft ID
  encounterId?: string; // If synced
  demographics: {
    firstName: string;
    lastName: string;
    dob: string; // YYYY-MM-DD for age calculation
    gender: string;
    mrn: string;
    chiefComplaint: string;
    symptomOnsetTime: string;
    lastKnownWellTime: string;
  };
  history: {
    medicalHistory: string;
    medications: string;
    allergies: string;
  };
  vitals: {
    systolicBP: string;
    diastolicBP: string;
    heartRate: string;
    oxygenSaturation: string;
    gcsScore: string;
  };
  labs: {
    glucose: string;
    inr: string;
  };
  imaging: {
    type: string;
    impression: string;
    aspects: string;
  };
  nihss: {
    levelOfConsciousness: string;
    locQuestions: string;
    locCommands: string;
    bestGaze: string;
    visualFields: string;
    facialPalsy: string;
    motorLeftArm: string;
    motorRightArm: string;
    motorLeftLeg: string;
    motorRightLeg: string;
    limbAtaxia: string;
    sensory: string;
    bestLanguage: string;
    dysarthria: string;
    extinctionInattention: string;
  };
}

const emptyState: IntakeState = {
  id: Date.now().toString(),
  demographics: { firstName: '', lastName: '', dob: '', gender: 'MALE', mrn: '', chiefComplaint: '', symptomOnsetTime: '', lastKnownWellTime: '' },
  history: { medicalHistory: '', medications: '', allergies: '' },
  vitals: { systolicBP: '', diastolicBP: '', heartRate: '', oxygenSaturation: '', gcsScore: '' },
  labs: { glucose: '', inr: '' },
  imaging: { type: 'CT Head (Non-contrast)', impression: '', aspects: '' },
  nihss: { levelOfConsciousness: '0', locQuestions: '0', locCommands: '0', bestGaze: '0', visualFields: '0', facialPalsy: '0', motorLeftArm: '0', motorRightArm: '0', motorLeftLeg: '0', motorRightLeg: '0', limbAtaxia: '0', sensory: '0', bestLanguage: '0', dysarthria: '0', extinctionInattention: '0' },
};

interface IntakeContextValue {
  draft: IntakeState;
  updateDraft: (section: keyof IntakeState, field: string, value: string) => void;
  saveDraft: () => Promise<void>;
  resetDraft: () => Promise<void>;
  calculateTotalNIHSS: () => number;
}

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function IntakeProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<IntakeState>(emptyState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load offline draft
    AsyncStorage.getItem('strokesync_active_draft').then((data) => {
      if (data) {
        try { setDraft(JSON.parse(data)); } catch (e) {}
      }
      setLoaded(true);
    });
  }, []);

  const updateDraft = (section: keyof IntakeState, field: string, value: string) => {
    if (section === 'id' || section === 'encounterId') return;
    setDraft((prev) => {
      const next = { ...prev, [section]: { ...(prev[section] as any), [field]: value } };
      AsyncStorage.setItem('strokesync_active_draft', JSON.stringify(next));
      return next;
    });
  };

  const saveDraft = async () => {
    await AsyncStorage.setItem('strokesync_active_draft', JSON.stringify(draft));
  };

  const resetDraft = async () => {
    const fresh = { ...emptyState, id: Date.now().toString() };
    setDraft(fresh);
    await AsyncStorage.setItem('strokesync_active_draft', JSON.stringify(fresh));
  };

  const calculateTotalNIHSS = () => {
    return Object.values(draft.nihss).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
  };

  if (!loaded) return null;

  return (
    <IntakeContext.Provider value={{ draft, updateDraft, saveDraft, resetDraft, calculateTotalNIHSS }}>
      {children}
    </IntakeContext.Provider>
  );
}

export const useIntake = () => {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error('useIntake must be used within IntakeProvider');
  return ctx;
};
