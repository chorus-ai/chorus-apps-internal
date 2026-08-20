import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface VisitHeaderConfig extends EndpointConfig {
  visitId?: number | string;
  personId?: number | string;
  staticTitle?: string;
  staticProvider?: string;
  staticLocation?: string;
  staticStartDate?: string;
  staticEndDate?: string;
  showProvider?: boolean;
  showLocation?: boolean;
  showDuration?: boolean;
}

const DATA_SHAPE = {
  visit_occurrence_id: 'number',
  visit_type: 'string',
  start_date: 'date',
  end_date: 'date',
  provider: 'string',
  location: 'string',
};

const VisitHeaderSettings: React.FC<WidgetSettingsProps<VisitHeaderConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof VisitHeaderConfig>(k: K, v: VisitHeaderConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
  return (
    <div className="space-y-4">
      <SourceToggle value={source} onChange={v => set('source', v)} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Visit ID</label>
          <input type="number" value={config.visitId ?? ''} onChange={e => set('visitId', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Person ID</label>
          <input type="number" value={config.personId ?? ''} onChange={e => set('personId', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
        </div>
      </div>
      {source === 'static' ? (
        <>
          <div>
            <label className={labelCls}>Title</label>
            <input type="text" value={config.staticTitle ?? ''} onChange={e => set('staticTitle', e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Provider</label>
              <input type="text" value={config.staticProvider ?? ''} onChange={e => set('staticProvider', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input type="text" value={config.staticLocation ?? ''} onChange={e => set('staticLocation', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Start Date</label>
              <input type="date" value={config.staticStartDate ?? ''} onChange={e => set('staticStartDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="date" value={config.staticEndDate ?? ''} onChange={e => set('staticEndDate', e.target.value)} className={inputCls} />
            </div>
          </div>
        </>
      ) : (
        <>
          <EndpointFields config={config} onChange={onChange} />
          <DataShape shape={DATA_SHAPE} />
        </>
      )}
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showProvider ?? true} onChange={e => set('showProvider', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Provider
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showLocation ?? true} onChange={e => set('showLocation', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Location
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showDuration ?? true} onChange={e => set('showDuration', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Duration
        </label>
      </div>
    </div>
  );
};

export default VisitHeaderSettings;
export const visitHeaderDefaults: VisitHeaderConfig = { source: 'endpoint', showProvider: true, showLocation: true, showDuration: true };
export const validateVisitHeaderConfig = validateEndpoint;
