import type { WidgetDefinition } from '../../shared/types';
import InterventionSuggestionsWidget from './widget';
import InterventionSuggestionsSettings, { InterventionConfig, interventionDefaults, validateInterventionConfig } from './settings';

const interventionSuggestions: WidgetDefinition<InterventionConfig> = {
  type: 'intervention_suggestions',
  label: 'Intervention Suggestions',
  description: 'Ranked intervention suggestions with per-axis risk deltas',
  icon: 'lightbulb',
  category: 'person',
  defaultLayout: { w: 6, h: 'lg' },
  Component: InterventionSuggestionsWidget,
  Settings: InterventionSuggestionsSettings,
  defaults: interventionDefaults,
  validate: validateInterventionConfig,
  presets: [
    { title: 'Intervention Suggestions', description: 'Ranked intervention suggestions with per-axis risk deltas', layout: { w: 6, h: 'lg' } },
  ],
};

export default interventionSuggestions;
