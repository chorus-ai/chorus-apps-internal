import type { WidgetDefinition } from '../../shared/types';
import AlarmTimelineWidget, { AlarmTimelineConfig } from './widget';
import AlarmTimelineSettings from './settings';

const alarmTimeline: WidgetDefinition<AlarmTimelineConfig> = {
  type: 'alarm_timeline',
  label: 'Monitor Alarms',
  description: 'Patient monitor alarm timeline: one tick row per alarm type with counts (mock data)',
  icon: 'notifications_active',
  category: 'person',
  defaultLayout: { w: 12, h: 'auto' },
  Component: AlarmTimelineWidget,
  Settings: AlarmTimelineSettings,
};

export default alarmTimeline;
