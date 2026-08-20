import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface ConditionConfig extends EndpointConfig {
  personId?: number | string;
  conceptIds?: string;
  activeOnly?: boolean;
  groupBy?: 'none' | 'category' | 'year' | 'status';
  limit?: number;
}

const DATA_SHAPE = {
  '[*].condition_concept_id': 'number',
  '[*].condition_name': 'string',
  '[*].start_date': 'date',
  '[*].end_date': 'date | null',
  '[*].status': 'string',
};

const OmopConditionOccurrenceSettings: React.FC<WidgetSettingsProps<ConditionConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof ConditionConfig>(k: K, v: ConditionConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
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
        <label className={labelCls}>Filter Concept IDs (comma separated)</label>
        <input type="text" value={config.conceptIds ?? ''} onChange={e => set('conceptIds', e.target.value)} placeholder="201826, 4034964" className={`${inputCls} font-mono`} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Group By</label>
          <select value={config.groupBy ?? 'none'} onChange={e => set('groupBy', e.target.value as ConditionConfig['groupBy'])} className={inputCls}>
            <option value="none">None</option>
            <option value="category">Category</option>
            <option value="year">Year</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Limit</label>
          <input type="number" min={1} value={config.limit ?? ''} onChange={e => set('limit', e.target.value ? Number(e.target.value) : undefined)} placeholder="50" className={inputCls} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" checked={config.activeOnly ?? false} onChange={e => set('activeOnly', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
        Active conditions only
      </label>
    </div>
  );
};

export default OmopConditionOccurrenceSettings;
export const conditionDefaults: ConditionConfig = { source: 'endpoint', groupBy: 'none', limit: 50 };
export const validateConditionConfig = validateEndpoint;
