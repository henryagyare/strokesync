import React from 'react';

export interface VitalCardProps {
  label: string;
  value: string | number;
  unit: string;
  isAbnormal?: boolean;
  isCritical?: boolean;
  trend?: 'up' | 'down' | 'stable';
  timestamp?: string;
  className?: string;
}

/**
 * VitalCard — displays a single vital sign with abnormal/critical state indicators.
 */
export const VitalCard: React.FC<VitalCardProps> = ({
  label,
  value,
  unit,
  isAbnormal = false,
  isCritical = false,
  trend,
  timestamp,
  className = '',
}) => {
  const stateClass = isCritical ? 'vital-card--critical' : isAbnormal ? 'vital-card--abnormal' : '';

  return React.createElement('div', {
    className: `vital-card ${stateClass} ${className}`.trim(),
    'data-critical': isCritical,
    'data-abnormal': isAbnormal,
    role: 'group',
    'aria-label': `${label}: ${value} ${unit}`,
  }, [
    React.createElement('span', { key: 'label', className: 'vital-card__label' }, label),
    React.createElement('div', { key: 'value-row', className: 'vital-card__value-row' }, [
      React.createElement('span', { key: 'value', className: 'vital-card__value' }, String(value)),
      React.createElement('span', { key: 'unit', className: 'vital-card__unit' }, unit),
      trend && React.createElement('span', { key: 'trend', className: `vital-card__trend vital-card__trend--${trend}` },
        trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
      ),
    ]),
    timestamp && React.createElement('span', { key: 'timestamp', className: 'vital-card__timestamp' }, timestamp),
  ]);
};
