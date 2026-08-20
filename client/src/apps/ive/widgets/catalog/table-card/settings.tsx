import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { inputCls, labelCls } from '../../shared/settingsShared';
import { TABLE_CARDS, type OmopTables } from '../../../types';

export interface TableCardConfig {
  tableKey?: keyof OmopTables;
  personId?: number | string;
  visitId?: number | string;
  showIcon?: boolean;
  showDescription?: boolean;
  showRowCount?: boolean;
  accent?: string;
}

const OmopTableCardSettings: React.FC<WidgetSettingsProps<TableCardConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof TableCardConfig>(k: K, v: TableCardConfig[K]) => onChange({ ...config, [k]: v });
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>OMOP Table</label>
        <select value={config.tableKey ?? ''} onChange={e => set('tableKey', e.target.value as keyof OmopTables)} className={inputCls}>
          <option value="">— Select —</option>
          {TABLE_CARDS.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Accent Color</label>
        <input type="color" value={config.accent ?? '#136dec'} onChange={e => set('accent', e.target.value)} className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showIcon ?? true} onChange={e => set('showIcon', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show icon
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showDescription ?? true} onChange={e => set('showDescription', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show description
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showRowCount ?? true} onChange={e => set('showRowCount', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show row count
        </label>
      </div>
    </div>
  );
};

export default OmopTableCardSettings;
export const tableCardDefaults: TableCardConfig = { showIcon: true, showDescription: true, showRowCount: true, accent: '#136dec' };
export function validateTableCardConfig(c: TableCardConfig): string[] {
  return c.tableKey ? [] : ['OMOP table is required.'];
}
