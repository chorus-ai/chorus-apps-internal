import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface VisitCostConfig extends EndpointConfig {
  visitId?: number | string;
  personId?: number | string;
  currency?: string;
  breakdown?: 'category' | 'department' | 'cpt';
  showInsuranceSplit?: boolean;
  staticTotal?: number;
  staticPaid?: number;
}

const DATA_SHAPE = {
  total: 'number',
  paid: 'number',
  outstanding: 'number',
  '[*].category': 'string',
  '[*].amount': 'number',
};

const VisitCostSettings: React.FC<WidgetSettingsProps<VisitCostConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof VisitCostConfig>(k: K, v: VisitCostConfig[K]) => onChange({ ...config, [k]: v });
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
      {source === 'endpoint' ? (
        <>
          <EndpointFields config={config} onChange={onChange} />
          <DataShape shape={DATA_SHAPE} />
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Total</label>
            <input type="number" min={0} value={config.staticTotal ?? ''} onChange={e => set('staticTotal', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Paid</label>
            <input type="number" min={0} value={config.staticPaid ?? ''} onChange={e => set('staticPaid', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Currency</label>
          <select value={config.currency ?? 'USD'} onChange={e => set('currency', e.target.value)} className={inputCls}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="MNT">MNT</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Breakdown</label>
          <select value={config.breakdown ?? 'category'} onChange={e => set('breakdown', e.target.value as VisitCostConfig['breakdown'])} className={inputCls}>
            <option value="category">Category</option>
            <option value="department">Department</option>
            <option value="cpt">CPT Code</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" checked={config.showInsuranceSplit ?? true} onChange={e => set('showInsuranceSplit', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
        Show insurance vs patient split
      </label>
    </div>
  );
};

export default VisitCostSettings;
export const visitCostDefaults: VisitCostConfig = { source: 'endpoint', currency: 'USD', breakdown: 'category', showInsuranceSplit: true };
export function validateVisitCostConfig(c: VisitCostConfig): string[] {
  const errors = validateEndpoint(c);
  if ((c.source ?? 'endpoint') === 'static' && c.staticPaid != null && c.staticTotal != null && c.staticPaid > c.staticTotal) {
    errors.push('Paid cannot exceed total.');
  }
  return errors;
}
