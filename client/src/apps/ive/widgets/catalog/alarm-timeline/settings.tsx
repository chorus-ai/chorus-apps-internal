import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField } from '../../shared/cohortSettings';
import type { AlarmTimelineConfig } from './widget';

const AlarmTimelineSettings: React.FC<WidgetSettingsProps<AlarmTimelineConfig>> = ({ config, onChange }) => (
  <div className="space-y-4">
    <PersonIdField config={config} onChange={onChange} />
    <p className="text-[11px] text-slate-400">
      Mock data: alarm channels and densities are synthesized deterministically
      from the Person ID until a monitor-alarm endpoint exists.
    </p>
  </div>
);

export default AlarmTimelineSettings;
