import React from 'react';
import { inputCls, labelCls } from '../../shared/settingsShared';
import type { WidgetSettingsProps } from '../../shared/types';
import {
  CohortWidgetConfig,
  PersonIdField,
  setter,
} from '../../shared/cohortSettings';

const CohortTimelineSettings: React.FC<WidgetSettingsProps<CohortWidgetConfig>> = ({ config, onChange }) => {
  const set = setter(config, onChange);
  return (
    <div className="space-y-4">
      <PersonIdField config={config} onChange={onChange} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Start Date</label>
          <input type="date" value={config.startDate ?? ''} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input type="date" value={config.endDate ?? ''} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
        </div>
      </div>
    </div>
  );
};

export default CohortTimelineSettings;
