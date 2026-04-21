import React from 'react';

export interface TimelineEventProps {
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

/**
 * TimelineEvent — displays a single event in a vertical timeline (e.g., encounter progression).
 */
export const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  description,
  timestamp,
  icon,
  isActive = false,
  isCompleted = false,
  className = '',
}) => {
  const stateClass = isActive ? 'timeline-event--active' : isCompleted ? 'timeline-event--completed' : '';

  return React.createElement('div', {
    className: `timeline-event ${stateClass} ${className}`.trim(),
    role: 'listitem',
  }, [
    React.createElement('div', { key: 'marker', className: 'timeline-event__marker' },
      icon ? React.createElement('span', { className: 'timeline-event__icon' }, icon) : null
    ),
    React.createElement('div', { key: 'content', className: 'timeline-event__content' }, [
      React.createElement('span', { key: 'title', className: 'timeline-event__title' }, title),
      description && React.createElement('span', { key: 'desc', className: 'timeline-event__description' }, description),
      React.createElement('span', { key: 'time', className: 'timeline-event__timestamp' }, timestamp),
    ]),
  ]);
};
