import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface OrganTrajectoryConfig extends EndpointConfig {
  personId?: number | string;
  organs?: string[];
  windowDays?: number;
  scoreScale?: number;
  showAlerts?: boolean;
}

const ALL_ORGANS = ['heart', 'lungs', 'liver', 'kidneys', 'brain', 'pancreas'];
const DATA_SHAPE = {
  '[*].organ': 'string',
  '[*].date': 'date',
  '[*].score': 'number',
  '[*].alert?': 'boolean',
};

const OrganTrajectorySettings: React.FC<WidgetSettingsProps<OrganTrajectoryConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof OrganTrajectoryConfig>(k: K, v: OrganTrajectoryConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
  const organs = config.organs ?? ALL_ORGANS;
  const toggle = (o: string) => {
    const s = new Set(organs);
    if (s.has(o)) s.delete(o); else s.add(o);
    set('organs', [...s]);
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
        <label className={labelCls}>Organs</label>
        <div className="flex flex-wrap gap-2">
          {ALL_ORGANS.map(o => {
            const on = organs.includes(o);
            return (
              <button key={o} type="button" onClick={() => toggle(o)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${on ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>{o}</button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Window (days)</label>
          <input type="number" min={1} value={config.windowDays ?? 180} onChange={e => set('windowDays', Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Score Scale (max)</label>
          <input type="number" min={1} value={config.scoreScale ?? 100} onChange={e => set('scoreScale', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" checked={config.showAlerts ?? true} onChange={e => set('showAlerts', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
        Highlight alert points
      </label>
    </div>
  );
};

export default OrganTrajectorySettings;
export const organTrajectoryDefaults: OrganTrajectoryConfig = { source: 'endpoint', organs: ALL_ORGANS, windowDays: 180, scoreScale: 100, showAlerts: true };
export const validateOrganTrajectoryConfig = validateEndpoint;
