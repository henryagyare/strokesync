import React from 'react';

export interface PatientSummaryCardProps {
  name: string;
  age: number;
  gender: string;
  mrn: string;
  status: string;
  chiefComplaint?: string;
  onsetTime?: string;
  nihssScore?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * PatientSummaryCard — compact card showing key patient information in sidebar lists.
 */
export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  name,
  age,
  gender,
  mrn,
  status,
  chiefComplaint,
  onsetTime,
  nihssScore,
  isSelected = false,
  onClick,
  className = '',
}) => {
  return React.createElement('div', {
    className: `patient-summary-card ${isSelected ? 'patient-summary-card--selected' : ''} ${className}`.trim(),
    onClick,
    role: 'button',
    tabIndex: 0,
    'aria-selected': isSelected,
    'aria-label': `Patient ${name}, ${age}${gender.charAt(0)}`,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
  }, [
    React.createElement('div', { key: 'header', className: 'patient-summary-card__header' }, [
      React.createElement('span', { key: 'name', className: 'patient-summary-card__name' }, name),
      React.createElement('span', { key: 'demo', className: 'patient-summary-card__demographics' }, `${age}${gender.charAt(0)}`),
    ]),
    React.createElement('div', { key: 'mrn', className: 'patient-summary-card__mrn' }, `MRN: ${mrn}`),
    chiefComplaint && React.createElement('div', { key: 'complaint', className: 'patient-summary-card__complaint' }, chiefComplaint),
    React.createElement('div', { key: 'footer', className: 'patient-summary-card__footer' }, [
      React.createElement('span', { key: 'status', className: 'patient-summary-card__status', 'data-status': status },
        status.replace(/_/g, ' ')
      ),
      nihssScore != null && React.createElement('span', { key: 'nihss', className: 'patient-summary-card__nihss' }, `NIHSS: ${nihssScore}`),
      onsetTime && React.createElement('span', { key: 'onset', className: 'patient-summary-card__onset' }, onsetTime),
    ]),
  ]);
};
