import React from 'react';
import { inputCls, labelCls } from '../../shared/settingsShared';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField, setter } from '../../shared/cohortSettings';
import RequestTemplateSection from '../../shared/RequestTemplateSection';
import type { PersonMeasurementsConfig } from './widget';

const PersonMeasurementsSettings: React.FC<WidgetSettingsProps<PersonMeasurementsConfig>> = ({ config, onChange }) => {
  const set = setter(config, onChange);
  return (
    <div className="space-y-4">
      <PersonIdField config={config} onChange={onChange} />
      <div>
        <label className={labelCls}>Row Limit</label>
        <input type="number" min={1} value={config.limit ?? 10} onChange={(e) => set('limit', Number(e.target.value))} className={inputCls} />
      </div>
      <RequestTemplateSection
        request={config.request}
        onChange={(next) => set('request', next)}
        placeholders={['personId', 'limit']}
        endpointPlaceholder="/api/omop/measurement/search?page=1&pageSize=0"
        bodyPlaceholder='{ "person_id": {{personId}} }'
      />
    </div>
  );
};

export default PersonMeasurementsSettings;
