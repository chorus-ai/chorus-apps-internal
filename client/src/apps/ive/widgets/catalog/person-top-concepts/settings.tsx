import React from 'react';
import { inputCls, labelCls } from '../../shared/settingsShared';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField, setter } from '../../shared/cohortSettings';
import RequestTemplateSection from '../../shared/RequestTemplateSection';
import { OMOP_TABLE_CARDS } from '../../../types';
import type { PersonTopConceptsConfig } from './widget';

const PersonTopConceptsSettings: React.FC<WidgetSettingsProps<PersonTopConceptsConfig>> = ({ config, onChange }) => {
  const set = setter(config, onChange);
  return (
    <div className="space-y-4">
      <PersonIdField config={config} onChange={onChange} />
      <div>
        <label className={labelCls}>OMOP Table</label>
        <select value={config.table ?? ''} onChange={(e) => set('table', e.target.value)} className={inputCls}>
          <option value="">— Select —</option>
          {OMOP_TABLE_CARDS.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-[1fr_120px] gap-2">
        <div>
          <label className={labelCls}>Concept Column</label>
          <input type="text" value={config.conceptCol ?? ''} onChange={(e) => set('conceptCol', e.target.value)} className={`${inputCls} font-mono`} placeholder="condition_concept_id" />
        </div>
        <div>
          <label className={labelCls}>Color</label>
          <input type="color" value={config.color ?? '#f97316'} onChange={(e) => set('color', e.target.value)} className={`${inputCls} h-[38px] p-1`} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Row Limit</label>
        <input type="number" min={1} value={config.limit ?? 8} onChange={(e) => set('limit', Number(e.target.value))} className={inputCls} />
      </div>
      <RequestTemplateSection
        request={config.request}
        onChange={(next) => set('request', next)}
        placeholders={['personId', 'table', 'conceptCol', 'limit']}
        endpointPlaceholder="/api/omop/{{table}}/search?page=1&pageSize=0"
        bodyPlaceholder='{ "person_id": {{personId}} }'
      />
    </div>
  );
};

export default PersonTopConceptsSettings;
