import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';
import { OMOP_TABLE_CARDS, type OmopTables } from '../../../types';

export interface DomainTableConfig extends EndpointConfig {
  personId?: number | string;
  domain?: keyof OmopTables;
  columns?: string[];
  rowLimit?: number;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
}

const DATA_SHAPE = { '[*].<column>': 'OMOP CDM column value' };

const OmopDomainTableSettings: React.FC<WidgetSettingsProps<DomainTableConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof DomainTableConfig>(k: K, v: DomainTableConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'endpoint';
  const card = OMOP_TABLE_CARDS.find(c => c.key === config.domain);
  const availableCols = card?.columns ?? [];
  const cols = config.columns ?? [];
  const toggleCol = (c: string) => {
    const s = new Set(cols);
    if (s.has(c)) s.delete(c); else s.add(c);
    set('columns', [...s]);
  };
  return (
    <div className="space-y-4">
      <SourceToggle value={source} onChange={v => set('source', v)} />
      <div>
        <label className={labelCls}>OMOP Domain</label>
        <select value={config.domain ?? ''} onChange={e => set('domain', e.target.value as keyof OmopTables)} className={inputCls}>
          <option value="">— Select —</option>
          {OMOP_TABLE_CARDS.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
        </select>
      </div>
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
      {availableCols.length > 0 && (
        <div>
          <label className={labelCls}>Columns ({cols.length} selected)</label>
          <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-lg">
            {availableCols.map(c => {
              const on = cols.includes(c);
              return (
                <button key={c} type="button" onClick={() => toggleCol(c)} className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${on ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>{c}</button>
              );
            })}
          </div>
        </div>
      )}
      <div className="grid grid-cols-[1fr_1fr_120px] gap-2">
        <div>
          <label className={labelCls}>Sort Field</label>
          <input type="text" value={config.sortField ?? ''} onChange={e => set('sortField', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Direction</label>
          <select value={config.sortDir ?? 'desc'} onChange={e => set('sortDir', e.target.value as 'asc' | 'desc')} className={inputCls}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Row Limit</label>
          <input type="number" min={1} value={config.rowLimit ?? 100} onChange={e => set('rowLimit', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
    </div>
  );
};

export default OmopDomainTableSettings;
export const domainTableDefaults: DomainTableConfig = { source: 'endpoint', rowLimit: 100, sortDir: 'desc' };
export function validateDomainTableConfig(c: DomainTableConfig): string[] {
  const errors = validateEndpoint(c);
  if (!c.domain) errors.push('OMOP domain is required.');
  return errors;
}
