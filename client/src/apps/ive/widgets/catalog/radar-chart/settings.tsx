import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface RadarAxis { label: string; max?: number; }

export interface RadarConfig extends EndpointConfig {
  axes?: RadarAxis[];
  staticValues?: number[];
  color?: string;
  fillOpacity?: number;
  scale?: 'linear' | 'log';
}

const DATA_SHAPE = {
  '[*].axis': 'string (matches axes[].label)',
  '[*].value': 'number',
};

const RadarChartSettings: React.FC<WidgetSettingsProps<RadarConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof RadarConfig>(k: K, v: RadarConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'static';
  const axes = config.axes ?? [];
  const values = config.staticValues ?? [];

  const updateAxis = (i: number, patch: Partial<RadarAxis>) => set('axes', axes.map((a, idx) => idx === i ? { ...a, ...patch } : a));
  const addAxis = () => {
    set('axes', [...axes, { label: '', max: 100 }]);
    set('staticValues', [...values, 0]);
  };
  const removeAxis = (i: number) => {
    set('axes', axes.filter((_, idx) => idx !== i));
    set('staticValues', values.filter((_, idx) => idx !== i));
  };
  const updateValue = (i: number, v: number) => set('staticValues', values.map((x, idx) => idx === i ? v : x));

  return (
    <div className="space-y-4">
      <SourceToggle value={source} onChange={v => set('source', v)} />
      {source === 'endpoint' && (
        <>
          <EndpointFields config={config} onChange={onChange} />
          <DataShape shape={DATA_SHAPE} />
        </>
      )}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>Axes</label>
          <button type="button" onClick={addAxis} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">add</span>Add Axis
          </button>
        </div>
        <div className="space-y-2">
          {axes.map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_80px_80px_auto] gap-2 items-center">
              <input type="text" value={a.label} onChange={e => updateAxis(i, { label: e.target.value })} placeholder="label" className={inputCls} />
              <input type="number" value={a.max ?? ''} onChange={e => updateAxis(i, { max: Number(e.target.value) })} placeholder="max" className={inputCls} />
              {source === 'static' ? (
                <input type="number" value={values[i] ?? 0} onChange={e => updateValue(i, Number(e.target.value))} placeholder="value" className={inputCls} />
              ) : <span />}
              <button type="button" onClick={() => removeAxis(i)} className="p-1 text-red-500 hover:text-red-600">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Color</label>
          <input type="color" value={config.color ?? '#136dec'} onChange={e => set('color', e.target.value)} className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
        </div>
        <div>
          <label className={labelCls}>Fill Opacity</label>
          <input type="number" min={0} max={1} step={0.05} value={config.fillOpacity ?? 0.3} onChange={e => set('fillOpacity', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Scale</label>
        <select value={config.scale ?? 'linear'} onChange={e => set('scale', e.target.value as 'linear' | 'log')} className={inputCls}>
          <option value="linear">Linear</option>
          <option value="log">Logarithmic</option>
        </select>
      </div>
    </div>
  );
};

export default RadarChartSettings;
export const radarDefaults: RadarConfig = { source: 'static', axes: [], staticValues: [], color: '#136dec', fillOpacity: 0.3, scale: 'linear' };
export function validateRadarConfig(c: RadarConfig): string[] {
  const errors = validateEndpoint(c);
  if (!c.axes || c.axes.length < 3) errors.push('At least 3 axes are required.');
  c.axes?.forEach((a, i) => { if (!a.label) errors.push(`Axis ${i + 1} label is required.`); });
  return errors;
}
