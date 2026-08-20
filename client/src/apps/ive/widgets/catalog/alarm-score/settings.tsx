import React from 'react';
import { inputCls, labelCls } from '../../shared/settingsShared';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField, setter } from '../../shared/cohortSettings';
import type { AlarmScoreConfig } from './widget';

const AlarmScoreSettings: React.FC<WidgetSettingsProps<AlarmScoreConfig>> = ({ config, onChange }) => {
  const set = setter(config, onChange);
  return (
    <div className="space-y-4">
      <PersonIdField config={config} onChange={onChange} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Trigger Threshold</label>
          <input
            type="number"
            min={0}
            max={100}
            value={config.threshold ?? 50}
            onChange={(e) => set('threshold', Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Event Count</label>
          <input
            type="number"
            min={1}
            value={config.eventCount ?? 260}
            onChange={(e) => set('eventCount', Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">
        Mock data: events are synthesized deterministically from the Person ID
        until a SuperAlarm score endpoint exists.
      </p>
    </div>
  );
};

export default AlarmScoreSettings;
