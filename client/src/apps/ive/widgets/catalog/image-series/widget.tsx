import React, { useState } from 'react';
import WidgetFrame from '../../WidgetFrame';
import type { WidgetComponentProps } from '../../shared/types';
import type { CohortWidgetConfig } from '../../shared/cohortSettings';
import chestXray from '../../../assets/chest-xray.jpg';
import cardiacMri from '../../../assets/cardiac-mri.jpg';

export type ImageSeriesConfig = CohortWidgetConfig;

/**
 * Study viewer placeholder: the bundled sample studies rendered as a small
 * series. Window/level variants are CSS filters until the DICOM pipeline
 * provides real series.
 */
const SLICES = [
  { label: 'XR 1',  src: chestXray,  study: 'CHEST XR',    filter: 'none' },
  { label: 'XR 2',  src: chestXray,  study: 'CHEST XR',    filter: 'brightness(1.3) contrast(1.1)' },
  { label: 'XR 3',  src: chestXray,  study: 'CHEST XR',    filter: 'invert(1) grayscale(1)' },
  { label: 'MRI 1', src: cardiacMri, study: 'CARDIAC MRI', filter: 'none' },
  { label: 'MRI 2', src: cardiacMri, study: 'CARDIAC MRI', filter: 'brightness(1.35) contrast(1.15)' },
  { label: 'MRI 3', src: cardiacMri, study: 'CARDIAC MRI', filter: 'contrast(1.5) brightness(0.85)' },
];

const ImageSeriesWidget: React.FC<WidgetComponentProps<ImageSeriesConfig>> = ({
  title, config: _config, isEditMode, onRemove, onEdit,
}) => {
  const [active, setActive] = useState(0);
  const slice = SLICES[active];

  return (
    <WidgetFrame title={title} isEditMode={isEditMode} onRemove={onRemove} onEdit={onEdit}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500 text-white">{SLICES.length}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">sample studies · mock series</span>
        </div>

        <div className="flex-1 min-h-0 flex gap-2">
          {/* min-h keeps the viewer usable when the frame has no height preset (h: 'auto'). */}
          <div className="flex-1 min-w-0 min-h-[280px] rounded-lg bg-black flex items-center justify-center overflow-hidden relative">
            <img
              src={slice.src}
              alt={`${slice.study} ${slice.label}`}
              className="max-w-full max-h-full object-contain"
              style={{ filter: slice.filter }}
            />
            <div className="absolute top-2 left-3 text-amber-300/80 text-[10px] font-mono leading-tight">
              <div>STUDY · {slice.study}</div>
              <div>{slice.label} · {active + 1} / {SLICES.length}</div>
            </div>
          </div>

          {/* Not `block`: a legacy m2d stylesheet hijacks that class into a fixed overlay. */}
          <div className="w-16 shrink-0 overflow-y-auto custom-scrollbar space-y-1.5">
            {SLICES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setActive(i)}
                className={`w-full h-16 rounded overflow-hidden bg-black border-2 transition-colors ${
                  i === active ? 'border-blue-500' : 'border-transparent hover:border-slate-400'
                }`}
                title={`${s.study} · ${s.label}`}
              >
                <img src={s.src} alt={s.label} className="w-full h-full object-cover" style={{ filter: s.filter }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
};

export default ImageSeriesWidget;
