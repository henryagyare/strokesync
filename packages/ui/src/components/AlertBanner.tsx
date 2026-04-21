import React from 'react';
import type { AlertSeverity } from '@strokesync/shared';

export interface AlertBannerProps {
  title: string;
  message: string;
  severity: AlertSeverity;
  dismissible?: boolean;
  onDismiss?: () => void;
  onAcknowledge?: () => void;
  timestamp?: string;
  className?: string;
}

/**
 * AlertBanner — real-time alert notification for critical events.
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  message,
  severity,
  dismissible = true,
  onDismiss,
  onAcknowledge,
  timestamp,
  className = '',
}) => {
  return React.createElement('div', {
    className: `alert-banner alert-banner--${severity.toLowerCase()} ${className}`.trim(),
    role: 'alert',
    'aria-live': severity === 'CRITICAL' || severity === 'EMERGENCY' ? 'assertive' : 'polite',
  }, [
    React.createElement('div', { key: 'content', className: 'alert-banner__content' }, [
      React.createElement('strong', { key: 'title', className: 'alert-banner__title' }, title),
      React.createElement('p', { key: 'message', className: 'alert-banner__message' }, message),
      timestamp && React.createElement('span', { key: 'time', className: 'alert-banner__timestamp' }, timestamp),
    ]),
    React.createElement('div', { key: 'actions', className: 'alert-banner__actions' }, [
      onAcknowledge && React.createElement('button', {
        key: 'ack',
        className: 'alert-banner__btn alert-banner__btn--acknowledge',
        onClick: onAcknowledge,
      }, 'Acknowledge'),
      dismissible && onDismiss && React.createElement('button', {
        key: 'dismiss',
        className: 'alert-banner__btn alert-banner__btn--dismiss',
        onClick: onDismiss,
        'aria-label': 'Dismiss alert',
      }, '×'),
    ]),
  ]);
};
