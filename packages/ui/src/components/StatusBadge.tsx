import React from 'react';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

/**
 * StatusBadge — displays patient/encounter status with color-coded indicators.
 * This is a headless component; styling is applied via className for platform flexibility.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  
  return React.createElement('span', {
    className: `status-badge status-badge--${variant} status-badge--${size} ${pulse ? 'status-badge--pulse' : ''} ${className}`.trim(),
    'data-status': status,
    'data-variant': variant,
    role: 'status',
    'aria-label': `Status: ${label}`,
  }, label);
};
