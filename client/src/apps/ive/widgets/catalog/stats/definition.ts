import type { WidgetDefinition } from '../../shared/types';
import PatientStatsWidget from './widget';
import PatientStatsSettings, { StatsConfig, statsDefaults, validateStatsConfig } from './settings';

const stats: WidgetDefinition<StatsConfig> = {
  type: 'stats',
  label: 'Stats Grid',
  description: 'High-level KPIs for a person',
  icon: 'grid_view',
  category: 'person',
  defaultLayout: { w: 4, h: 'auto' },
  Component: PatientStatsWidget,
  Settings: PatientStatsSettings,
  defaults: statsDefaults,
  validate: validateStatsConfig,
  presets: [
    { title: 'Vital Signs Summary', description: 'KPIs for BP, Heart Rate, and BMI', layout: { w: 4, h: 'auto' } },
  ],
};

export default stats;
