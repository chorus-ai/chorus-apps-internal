import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface MedAdherenceConfig extends EndpointConfig {
  personId?: number | string;
  drugConceptIds?: string;
  metric?: 'pdc' | 'mpr' | 'gap_days';
  thresholdGood?: number;
  thresholdWarn?: number;
  windowDays?: number;
}

const DATA_SHAPE = {
  '[*].drug_name': 'string',
  '[*].drug_concept_id': 'number',
  '[*].adherence': 'number (0-1)',
  '[*].gap_days': 'number',
};

const MedicationAdherenceSettings: React.FC<WidgetSettingsProps<MedAdherenceConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof MedAdherenceConfig>(k: K, v: MedAdherenceConfig[K]) => onChange({ ...config, [k]: v });
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
        <label className={labelCls}>Drug Concept IDs (comma separated)</label>
        <input type="text" value={config.drugConceptIds ?? ''} onChange={e => set('drugConceptIds', e.target.value)} placeholder="1503297, 1308216" className={`${inputCls} font-mono`} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Metric</label>
          <select value={config.metric ?? 'pdc'} onChange={e => set('metric', e.target.value as MedAdherenceConfig['metric'])} className={inputCls}>
            <option value="pdc">PDC (Proportion of Days Covered)</option>
            <option value="mpr">MPR (Medication Possession Ratio)</option>
            <option value="gap_days">Gap Days</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Window (days)</label>
          <input type="number" min={1} value={config.windowDays ?? 365} onChange={e => set('windowDays', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Good Threshold</label>
          <input type="number" min={0} max={1} step={0.05} value={config.thresholdGood ?? 0.8} onChange={e => set('thresholdGood', Number(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Warn Threshold</label>
          <input type="number" min={0} max={1} step={0.05} value={config.thresholdWarn ?? 0.6} onChange={e => set('thresholdWarn', Number(e.target.value))} className={inputCls} />
        </div>
      </div>
    </div>
  );
};

export default MedicationAdherenceSettings;
export const medAdherenceDefaults: MedAdherenceConfig = { source: 'endpoint', metric: 'pdc', thresholdGood: 0.8, thresholdWarn: 0.6, windowDays: 365 };
export function validateMedAdherenceConfig(c: MedAdherenceConfig): string[] {
  const errors = validateEndpoint(c);
  if (c.thresholdGood != null && c.thresholdWarn != null && c.thresholdWarn >= c.thresholdGood) {
    errors.push('Warn threshold must be lower than good threshold.');
  }
  return errors;
}
