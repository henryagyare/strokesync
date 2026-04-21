import React from 'react';
import { getNIHSSSeverity, NIHSS_SEVERITY, type NIHSSSeverityLevel } from '@strokesync/shared';

export interface NIHSSScoreDisplayProps {
  score: number;
  previousScore?: number;
  assessedAt?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SEVERITY_COLORS: Record<NIHSSSeverityLevel, string> = {
  NONE: '#22c55e',
  MINOR: '#84cc16',
  MODERATE: '#f59e0b',
  MODERATE_SEVERE: '#f97316',
  SEVERE: '#ef4444',
};

/**
 * NIHSSScoreDisplay — visual NIHSS score indicator with severity classification.
 */
export const NIHSSScoreDisplay: React.FC<NIHSSScoreDisplayProps> = ({
  score,
  previousScore,
  assessedAt,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const severity = getNIHSSSeverity(score);
  const severityInfo = NIHSS_SEVERITY[severity];
  const delta = previousScore != null ? score - previousScore : null;

  return React.createElement('div', {
    className: `nihss-display nihss-display--${size} ${className}`.trim(),
    role: 'group',
    'aria-label': `NIHSS Score: ${score} - ${severityInfo.label}`,
  }, [
    React.createElement('div', {
      key: 'score',
      className: 'nihss-display__score',
      style: { color: SEVERITY_COLORS[severity] },
    }, String(score)),
    showLabel && React.createElement('span', {
      key: 'label',
      className: 'nihss-display__label',
    }, severityInfo.label),
    delta != null && React.createElement('span', {
      key: 'delta',
      className: `nihss-display__delta ${delta > 0 ? 'nihss-display__delta--worse' : delta < 0 ? 'nihss-display__delta--better' : ''}`,
    }, delta > 0 ? `+${delta}` : String(delta)),
    assessedAt && React.createElement('span', {
      key: 'time',
      className: 'nihss-display__time',
    }, assessedAt),
  ]);
};
