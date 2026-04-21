// ─── Shared Utility Functions ──────────────────────────────

import { VITAL_RANGES } from '../constants';

/**
 * Generate a Medical Record Number
 */
export function generateMRN(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SS-${timestamp}-${random}`;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Check if a vital sign value is in critical range
 */
export function isVitalCritical(
  vitalType: keyof typeof VITAL_RANGES,
  value: number,
): boolean {
  const range = VITAL_RANGES[vitalType];
  return value <= range.criticalLow || value >= range.criticalHigh;
}

/**
 * Check if a vital sign value is abnormal (outside normal range)
 */
export function isVitalAbnormal(
  vitalType: keyof typeof VITAL_RANGES,
  value: number,
): boolean {
  const range = VITAL_RANGES[vitalType];
  return value < range.low || value > range.high;
}

/**
 * Format elapsed time since symptom onset
 */
export function formatTimeFromOnset(onsetTime: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(onsetTime).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Check if patient is within tPA treatment window
 */
export function isWithinTPAWindow(onsetTime: Date): boolean {
  const now = new Date();
  const diffMs = now.getTime() - new Date(onsetTime).getTime();
  return diffMs <= 4.5 * 60 * 60 * 1000; // 4.5 hours
}

/**
 * Format a patient name (Last, First)
 */
export function formatPatientName(firstName: string, lastName: string): string {
  return `${lastName}, ${firstName}`;
}

/**
 * Mask PHI data for display based on user role
 */
export function maskPHI(value: string, showChars: number = 3): string {
  if (!value || value.length <= showChars) return '***';
  return value.substring(0, showChars) + '*'.repeat(Math.max(0, value.length - showChars));
}

/**
 * Format blood pressure reading
 */
export function formatBP(systolic?: number, diastolic?: number): string {
  if (systolic == null || diastolic == null) return 'N/A';
  return `${systolic}/${diastolic} mmHg`;
}

/**
 * Deep clone an object (safe for serializable data)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Create a delay promise (useful for simulated data)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
