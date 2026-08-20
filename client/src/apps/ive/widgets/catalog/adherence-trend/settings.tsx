import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface AdherenceTrendConfig extends EndpointConfig {
  personId?: number | string;
  drugConceptId?: number | string;
  granularity?: 'day' | 'week' | 'month';
  rangeDays?: number;
  showTarget?: boolean;
  target?: number;
}

const DATA_SHAPE = {
  '[*].period': 'string (date)',
  '[*].adherence': 'number (0-1)',
};

const AdherenceTrendSettings: React.FC<WidgetSettingsProps<AdherenceTrendConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof AdherenceTrendConfig>(k: K, v: AdherenceTrendConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
  return (
    <div className="space-y-4">
      <SourceToggle value={source} onChange={v => set('source', v)} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Person ID</label>
          <input type="number" value={config.personId ?? ''} onChange={e => set('personId', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Drug Concept ID</label>
          <input type="number" value={config.drugConceptId ?? ''} onChange={e => set('drugConceptId', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
        </div>
      </div>
      {source === 'endpoint' && (
        <>
          <EndpointFields config={config} onChange={onChange} />
          <DataShape shape={DATA_SHAPE} />
        </>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Granularity</label>
          <select value={config.granularity ?? 'week'} onChange={e => set('granularity', e.target.value as AdherenceTrendConfig['granularity'])} className={inputCls}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Range (days)</label>
          <input type="number" min={1} value={config.rangeDays ?? 180} onChange={e => set('rangeDays', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 flex-1">
          <input type="checkbox" checked={config.showTarget ?? true} onChange={e => set('showTarget', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show target line
        </label>
        {config.showTarget !== false && (
          <div className="flex-1">
            <label className={labelCls}>Target</label>
            <input type="number" min={0} max={1} step={0.05} value={config.target ?? 0.8} onChange={e => set('target', Number(e.target.value))} className={inputCls} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdherenceTrendSettings;
export const adherenceTrendDefaults: AdherenceTrendConfig = { source: 'endpoint', granularity: 'week', rangeDays: 180, showTarget: true, target: 0.8 };
export const validateAdherenceTrendConfig = validateEndpoint;
