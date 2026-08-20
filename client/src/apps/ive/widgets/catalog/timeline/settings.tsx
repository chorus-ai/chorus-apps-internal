import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface TimelineConfig extends EndpointConfig {
  personId?: number | string;
  eventTypes?: string[];
  rangeStart?: string;
  rangeEnd?: string;
  density?: 'compact' | 'comfortable';
  showMilestones?: boolean;
}

const EVENT_TYPES = ['visit', 'condition', 'drug', 'procedure', 'measurement', 'observation', 'note'];

const DATA_SHAPE = {
  '[*].event_type': 'string',
  '[*].date': 'date',
  '[*].label': 'string',
  '[*].value': 'string | number',
};

const TimelineSummarySettings: React.FC<WidgetSettingsProps<TimelineConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof TimelineConfig>(k: K, v: TimelineConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
  const types = config.eventTypes ?? EVENT_TYPES;
  const toggle = (t: string) => {
    const s = new Set(types);
    if (s.has(t)) s.delete(t); else s.add(t);
    set('eventTypes', [...s]);
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
        <label className={labelCls}>Event Types</label>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map(t => {
            const on = types.includes(t);
            return (
              <button key={t} type="button" onClick={() => toggle(t)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${on ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>{t}</button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Range Start</label>
          <input type="date" value={config.rangeStart ?? ''} onChange={e => set('rangeStart', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Range End</label>
          <input type="date" value={config.rangeEnd ?? ''} onChange={e => set('rangeEnd', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 items-end">
        <div>
          <label className={labelCls}>Density</label>
          <select value={config.density ?? 'comfortable'} onChange={e => set('density', e.target.value as TimelineConfig['density'])} className={inputCls}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showMilestones ?? true} onChange={e => set('showMilestones', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show milestones
        </label>
      </div>
    </div>
  );
};

export default TimelineSummarySettings;
export const timelineDefaults: TimelineConfig = { source: 'endpoint', eventTypes: EVENT_TYPES, density: 'comfortable', showMilestones: true };
export function validateTimelineConfig(c: TimelineConfig): string[] {
  const errors = validateEndpoint(c);
  if (c.rangeStart && c.rangeEnd && c.rangeStart > c.rangeEnd) errors.push('Range start must be before end.');
  return errors;
}
