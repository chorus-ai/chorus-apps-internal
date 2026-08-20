import React from 'react';
import { inputCls, labelCls } from '../../shared/settingsShared';
import type { WidgetSettingsProps } from '../../shared/types';
import { PersonIdField } from '../../shared/cohortSettings';
import RequestTemplateSection from '../../shared/RequestTemplateSection';
import type { MeasurementTrendConfig } from './widget';

const MeasurementTrendSettings: React.FC<WidgetSettingsProps<MeasurementTrendConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof MeasurementTrendConfig>(k: K, v: MeasurementTrendConfig[K]) =>
    onChange({ ...config, [k]: v });

  return (
    <div className="space-y-4">
      <PersonIdField config={config} onChange={onChange} />
      <div>
        <label className={labelCls}>Measurement Concept IDs</label>
        <input
          type="text"
          value={config.conceptIds ?? ''}
          onChange={(e) => set('conceptIds', e.target.value || undefined)}
          placeholder="e.g. 3018405, 3047181 (comma-separated)"
          className={`${inputCls} font-mono`}
        />
      </div>
      <div>
        <label className={labelCls}>Or Source Value Contains</label>
        <input
          type="text"
          value={config.sourceValue ?? ''}
          onChange={(e) => set('sourceValue', e.target.value || undefined)}
          placeholder="e.g. Lactate (used when no concept IDs)"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-[1fr_120px] gap-2">
        <div>
          <label className={labelCls}>Max Points</label>
          <input
            type="number"
            min={2}
            value={config.limit ?? 100}
            onChange={(e) => set('limit', Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Color</label>
          <input
            type="color"
            value={config.color ?? '#136dec'}
            onChange={(e) => set('color', e.target.value)}
            className={`${inputCls} h-[38px] p-1`}
          />
        </div>
      </div>

      <RequestTemplateSection
        request={config.request}
        onChange={(next) => set('request', next)}
        placeholders={['personId', 'conceptIds (number[])', 'sourceValue']}
        endpointPlaceholder="/api/omop/measurement/search?page=1&pageSize=0"
        bodyPlaceholder='{ "person_id": {{personId}}, "measurement_concept_id": {{conceptIds}} }'
      />
    </div>
  );
};

export default MeasurementTrendSettings;
