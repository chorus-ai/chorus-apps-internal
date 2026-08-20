import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface StatsConfig extends EndpointConfig {
  personId?: number | string;
  metrics?: string[];
  layout?: 'row' | 'grid';
  showTrend?: boolean;
}

const ALL_METRICS = ['visits', 'conditions', 'drugs', 'procedures', 'measurements', 'observations'];
const DATA_SHAPE = { '<metric>': 'number', '<metric>_trend?': 'number' };

const PatientStatsSettings: React.FC<WidgetSettingsProps<StatsConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof StatsConfig>(k: K, v: StatsConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
  const metrics = config.metrics ?? ALL_METRICS;
  const toggle = (m: string) => {
    const s = new Set(metrics);
    if (s.has(m)) s.delete(m); else s.add(m);
    set('metrics', [...s]);
  };
  return (
    <div className="space-y-4">
      <SourceToggle value={source} onChange={v => set('source', v)} />
      <div>
        <label className={labelCls}>Person ID</label>
        <input type="number" value={config.personId ?? ''} onChange={e => set('personId', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
      </div>
      {source === 'endpoint' && (
        <>
          <EndpointFields config={config} onChange={onChange} />
          <DataShape shape={DATA_SHAPE} />
        </>
      )}
      <div>
        <label className={labelCls}>Metrics</label>
        <div className="flex flex-wrap gap-2">
          {ALL_METRICS.map(m => {
            const on = metrics.includes(m);
            return (
              <button key={m} type="button" onClick={() => toggle(m)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${on ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>{m}</button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 items-end">
        <div>
          <label className={labelCls}>Layout</label>
          <select value={config.layout ?? 'row'} onChange={e => set('layout', e.target.value as 'row' | 'grid')} className={inputCls}>
            <option value="row">Row</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showTrend ?? true} onChange={e => set('showTrend', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show trend deltas
        </label>
      </div>
    </div>
  );
};

export default PatientStatsSettings;
export const statsDefaults: StatsConfig = { source: 'endpoint', metrics: ALL_METRICS, layout: 'row', showTrend: true };
export const validateStatsConfig = validateEndpoint;
