import type { WidgetDefinition } from '../../shared/types';
import TimelineSummaryWidget from './widget';
import TimelineSummarySettings, { TimelineConfig, timelineDefaults, validateTimelineConfig } from './settings';

const timeline: WidgetDefinition<TimelineConfig> = {
  type: 'timeline',
  label: 'Visit Timeline',
  description: 'Chronological view of clinical encounters',
  icon: 'event_repeat',
  category: 'person',
  defaultLayout: { w: 6, h: 'md' },
  Component: TimelineSummaryWidget,
  Settings: TimelineSummarySettings,
  defaults: timelineDefaults,
  validate: validateTimelineConfig,
  presets: [
    { title: 'Visit Timeline', description: 'Chronological view of clinical encounters', layout: { w: 6, h: 'md' } },
  ],
};

export default timeline;
