import React from 'react';
import { inputCls, labelCls } from '../../shared/settingsShared';
import type { WidgetSettingsProps } from '../../shared/types';
import type { WaveformConfig } from './widget';

const WaveformSettings: React.FC<WidgetSettingsProps<WaveformConfig>> = ({ config, onChange }) => {
  const set = <K extends keyof WaveformConfig>(k: K, v: WaveformConfig[K]) =>
    onChange({ ...config, [k]: v });
  const showControls = config.showControls !== false;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Record Path</label>
        <input
          type="text"
          value={config.filename ?? ''}
          onChange={(e) => set('filename', e.target.value || undefined)}
          placeholder="waveforms/mimic_iv/p100/…/85594648_0001 (sample record if empty)"
          className={`${inputCls} font-mono`}
        />
      </div>
      <div>
        <label className={labelCls}>Start Offset (s)</label>
        <input
          type="number"
          min={0}
          value={config.offset ?? 0}
          onChange={(e) => set('offset', Math.max(0, Number(e.target.value)))}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Display</label>
        <button
          type="button"
          onClick={() => set('showControls', !showControls)}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
            showControls
              ? 'bg-primary text-white border-primary'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
          }`}
        >
          Record path / offset controls
        </button>
      </div>
    </div>
  );
};

export default WaveformSettings;
