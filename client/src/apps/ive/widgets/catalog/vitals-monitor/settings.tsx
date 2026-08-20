import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField } from '../../shared/cohortSettings';
import type { VitalsMonitorConfig } from './widget';

const VitalsMonitorSettings: React.FC<WidgetSettingsProps<VitalsMonitorConfig>> = ({ config, onChange }) => (
  <div className="space-y-4">
    <PersonIdField config={config} onChange={onChange} />
    <p className="text-[11px] text-slate-400">
      Mock data: HR / RESP / SpO2 trends are synthesized deterministically from
      the Person ID until a vitals trend endpoint exists.
    </p>
  </div>
);

export default VitalsMonitorSettings;
