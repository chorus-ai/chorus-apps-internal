import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField } from '../../shared/cohortSettings';
import type { LabsDotplotConfig } from './widget';

const LabsDotplotSettings: React.FC<WidgetSettingsProps<LabsDotplotConfig>> = ({ config, onChange }) => (
  <div className="space-y-4">
    <PersonIdField config={config} onChange={onChange} />
    <p className="text-[11px] text-slate-400">
      Mock data: lab draws are synthesized deterministically from the Person ID.
      A data-backed version can query /api/omop/measurement per analyte.
    </p>
  </div>
);

export default LabsDotplotSettings;
