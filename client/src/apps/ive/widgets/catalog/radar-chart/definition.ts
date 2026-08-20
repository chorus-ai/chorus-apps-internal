import type { WidgetDefinition } from '../../shared/types';
import RadarChartWidget from './widget';
import RadarChartSettings, { RadarConfig, radarDefaults, validateRadarConfig } from './settings';

const radarChart: WidgetDefinition<RadarConfig> = {
  type: 'radar_chart',
  label: 'Radar Chart',
  description: 'Multi-axis risk comparison',
  icon: 'radar',
  category: 'chart',
  defaultLayout: { w: 4, h: 'md' },
  Component: RadarChartWidget,
  Settings: RadarChartSettings,
  defaults: radarDefaults,
  validate: validateRadarConfig,
  presets: [
    { title: 'Risk Radar', description: 'Multi-axis risk comparison', layout: { w: 4, h: 'md' } },
  ],
};

export default radarChart;
