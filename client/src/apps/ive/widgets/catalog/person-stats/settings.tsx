import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { CohortWidgetConfig, PersonIdField } from '../../shared/cohortSettings';

const PersonStatsSettings: React.FC<WidgetSettingsProps<CohortWidgetConfig>> = ({ config, onChange }) => (
  <div className="space-y-4">
    <PersonIdField config={config} onChange={onChange} />
  </div>
);

export default PersonStatsSettings;
