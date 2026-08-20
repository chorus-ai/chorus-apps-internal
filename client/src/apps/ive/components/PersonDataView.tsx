import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OMOP_TABLE_CARDS, WidgetConfig, type OmopTables } from '../types';
import { getOmopCount } from '../api/omop';
import RegistryWidget from '../widgets/Widget';

const PersonDataView: React.FC = () => {
  const { personId = '' } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const baseWidgets: WidgetConfig[] = [
    { id: 'p-header', type: 'patient_profile', title: `${personId} (Historical Record)`, w: 12, h: 'auto', config: { personId } },
   ];

  const [omopWidgets, setOmopWidgets] = useState<WidgetConfig[]>([]);

  useEffect(() => {
    if (!personId) return;
    let cancelled = false;

    Promise.all(
      OMOP_TABLE_CARDS.filter((card) => card.key !== 'person').map(async (card) => {
        try {
          const count = await getOmopCount(card.key, { person_id: personId });
          return { card, count };
        } catch {
          return { card, count: 0 };
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      const widgets = results
        .filter(({ count }) => count > 0)
        .map(({ card }) => ({
          id: `p-omop-${card.key}`,
          type: 'table_card' as const,
          title: card.name,
          w: 6,
          h: 'auto' as const,
          config: {
            tableKey: card.key as keyof OmopTables,
            personId,
          },
        }));
      setOmopWidgets(widgets);
    });

    return () => { cancelled = true; };
  }, [personId]);

  const widgets = [...baseWidgets, ...omopWidgets];

  return (
    <div className="flex flex-1 overflow-hidden h-full flex-col bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Person View</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Person ID: {personId}</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
          {widgets.map((widget) => (
            <div key={widget.id} className={`col-span-12 md:col-span-${widget.w}`}>
              <RegistryWidget
                widget={widget}
                onRemove={() => {}}
                isEditMode={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonDataView;
