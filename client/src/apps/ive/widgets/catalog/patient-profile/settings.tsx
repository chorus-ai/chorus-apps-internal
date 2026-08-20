import React from 'react';
import type { WidgetSettingsProps } from '../../shared/types';
import { DataShape, EndpointConfig, EndpointFields, SourceToggle, inputCls, labelCls, validateEndpoint } from '../../shared/settingsShared';

export interface PatientProfileConfig extends EndpointConfig {
  personId?: number | string;
  staticName?: string;
  staticDob?: string;
  staticGender?: string;
  staticMrn?: string;
  showPhoto?: boolean;
  showMRN?: boolean;
}

const DATA_SHAPE = {
  person_id: 'number',
  name: 'string',
  dob: 'date',
  gender: 'string',
  mrn: 'string',
};

const PatientProfileSettings: React.FC<WidgetSettingsProps<PatientProfileConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof PatientProfileConfig>(k: K, v: PatientProfileConfig[K]) => onChange({ ...config, [k]: v });
  const source = config.source ?? 'static';
  return (
    <div className="space-y-4">
      <SourceToggle value={source} onChange={v => set('source', v)} />
      <div>
        <label className={labelCls}>Person ID</label>
        <input type="number" value={config.personId ?? ''} onChange={e => set('personId', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
      </div>
      {source === 'static' ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Name</label>
              <input type="text" value={config.staticName ?? ''} onChange={e => set('staticName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>MRN</label>
              <input type="text" value={config.staticMrn ?? ''} onChange={e => set('staticMrn', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>DOB</label>
              <input type="date" value={config.staticDob ?? ''} onChange={e => set('staticDob', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Gender</label>
              <select value={config.staticGender ?? ''} onChange={e => set('staticGender', e.target.value)} className={inputCls}>
                <option value="">—</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <>
          <EndpointFields config={config} onChange={onChange} />
          <DataShape shape={DATA_SHAPE} />
        </>
      )}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showPhoto ?? true} onChange={e => set('showPhoto', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show Photo
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={config.showMRN ?? true} onChange={e => set('showMRN', e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
          Show MRN
        </label>
      </div>
    </div>
  );
};

export default PatientProfileSettings;
export const patientProfileDefaults: PatientProfileConfig = { source: 'static', showPhoto: true, showMRN: true };
export const validatePatientProfileConfig = validateEndpoint;
