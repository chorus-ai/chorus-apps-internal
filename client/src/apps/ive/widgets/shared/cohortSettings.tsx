import React from 'react';
import { inputCls, labelCls } from './settingsShared';

/**
 * Shared config + settings primitives for the person-scoped (subject) OMOP
 * widgets. These widgets query the OMOP endpoints (`/api/omop/<table>`)
 * internally; the config only carries the domain parameters (Person ID,
 * date range, table…) that scope those queries.
 */

export interface CohortWidgetConfig {
  personId?: number | string;
  startDate?: string;
  endDate?: string;
  table?: string;
  conceptCol?: string;
  color?: string;
  topN?: number;
  limit?: number;
}

// Defaults mirror the first record of the sample cohort so the widgets render
// out of the box; the per-widget settings panel overrides these.
export const DEFAULT_PERSON_ID = 4009;
export const DEFAULT_START_DATE = '2020-03-14';
export const DEFAULT_END_DATE = '2020-04-13';

export const personOf = (config?: CohortWidgetConfig) =>
  config?.personId ?? DEFAULT_PERSON_ID;

interface Props {
  config: CohortWidgetConfig;
  onChange: (next: CohortWidgetConfig) => void;
}

export const setter =
  <C extends CohortWidgetConfig>(config: C, onChange: (n: C) => void) =>
  <K extends keyof C>(k: K, v: C[K]) =>
    onChange({ ...config, [k]: v });

export const PersonIdField: React.FC<Props> = ({ config, onChange }) => {
  const set = setter(config, onChange);
  return (
    <div>
      <label className={labelCls}>Person ID</label>
      <input
        type="number"
        value={config.personId ?? ''}
        onChange={(e) => set('personId', e.target.value ? Number(e.target.value) : undefined)}
        className={inputCls}
        placeholder="e.g. 4009"
      />
    </div>
  );
};

export const requirePerson = (c: CohortWidgetConfig): string[] =>
  c.personId == null || c.personId === '' ? ['Person ID is required.'] : [];
