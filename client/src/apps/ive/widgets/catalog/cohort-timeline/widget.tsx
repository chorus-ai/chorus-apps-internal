import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CustomChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import { getOmopRows as realGetOmopRows, type OmopTabularResponse } from '../../../api/omop';
import { loadConcept } from '../../../api/concepts';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import WidgetFrame from '../../WidgetFrame';
import type { WidgetComponentProps } from '../../shared/types';
import {
  CohortWidgetConfig,
  DEFAULT_END_DATE,
  DEFAULT_START_DATE,
  personOf,
} from '../../shared/cohortSettings';

echarts.use([TooltipComponent, GridComponent, DataZoomComponent, CustomChart, CanvasRenderer]);

const USE_MOCK = false;

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const ROW_HEIGHT = 36;
const GRID_TOP = 16;
const GRID_BOTTOM = 60;
const BAR_WIDTH = 3;

type CategoryDef = {
  table: string;
  label: string;
  color: string;
  dateField: string;
  dateColPreferred: string;
  dateColFallback: string;
  conceptCol: string;
};

const CATEGORY_DEFS: CategoryDef[] = [
  { table: 'visit_detail',         label: 'Visit',        color: '#a855f7',
    dateField: 'visit_detail_start_date',    dateColPreferred: 'visit_detail_start_datetime',    dateColFallback: 'visit_detail_start_date',    conceptCol: 'visit_detail_concept_id' },
  { table: 'condition_occurrence', label: 'Condition',    color: '#f97316',
    dateField: 'condition_start_date',       dateColPreferred: 'condition_start_datetime',       dateColFallback: 'condition_start_date',       conceptCol: 'condition_concept_id' },
  { table: 'drug_exposure',        label: 'Drug',         color: '#3b82f6',
    dateField: 'drug_exposure_start_date',   dateColPreferred: 'drug_exposure_start_datetime',   dateColFallback: 'drug_exposure_start_date',   conceptCol: 'drug_concept_id' },
  { table: 'procedure_occurrence', label: 'Procedure',    color: '#8b5cf6',
    dateField: 'procedure_date',             dateColPreferred: 'procedure_datetime',             dateColFallback: 'procedure_date',             conceptCol: 'procedure_concept_id' },
  { table: 'device_exposure',      label: 'Device',       color: '#06b6d4',
    dateField: 'device_exposure_start_date', dateColPreferred: 'device_exposure_start_datetime', dateColFallback: 'device_exposure_start_date', conceptCol: 'device_concept_id' },
  { table: 'measurement',          label: 'Measurement',  color: '#10b981',
    dateField: 'measurement_date',           dateColPreferred: 'measurement_datetime',           dateColFallback: 'measurement_date',           conceptCol: 'measurement_concept_id' },
  { table: 'observation',          label: 'Observation',  color: '#f59e0b',
    dateField: 'observation_date',           dateColPreferred: 'observation_datetime',           dateColFallback: 'observation_date',           conceptCol: 'observation_concept_id' },
];

const CATEGORIES = CATEGORY_DEFS.map((c) => c.label);

const MOCK_DENSITY: Record<string, number> = {
  visit_detail: 14,
  condition_occurrence: 25,
  drug_exposure: 60,
  procedure_occurrence: 15,
  device_exposure: 6,
  measurement: 120,
  observation: 40,
};

const toIsoDate = (ts: number) => new Date(ts).toISOString().slice(0, 10);

const mockGetOmopRows = (
  table: string,
  _params: { page: number; pageSize: number },
  filters?: Record<string, unknown>,
): Promise<OmopTabularResponse> => {
  const def = CATEGORY_DEFS.find((d) => d.table === table);
  if (!def) return Promise.resolve({ header: [], rows: [] });

  const dateFilter = filters?.[def.dateField] as { between?: [string, string] } | undefined;
  const fromTs = dateFilter?.between?.[0] ? new Date(dateFilter.between[0]).getTime() : Date.now() - 30 * DAY;
  const toTs = dateFilter?.between?.[1] ? new Date(dateFilter.between[1]).getTime() + DAY - 1 : Date.now();

  const header = [def.dateColFallback, def.dateColPreferred, def.conceptCol];
  const count = MOCK_DENSITY[table] ?? 20;
  const rows: unknown[][] = [];
  for (let i = 0; i < count; i++) {
    const ts = fromTs + Math.random() * (toTs - fromTs);
    const d = new Date(ts);
    rows.push([
      d.toISOString().slice(0, 10),
      d.toISOString().replace('T', ' ').slice(0, 19),
      1000000 + Math.floor(Math.random() * 99999),
    ]);
  }

  const latency = 150 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(() => resolve({ header, rows, count }), latency));
};

const getOmopRows = USE_MOCK ? mockGetOmopRows : realGetOmopRows;

interface CohortEventsTimelineProps {
  personId: string | number;
  startDate: string;
  endDate: string;
  /** When rendered inside a WidgetFrame, drop the standalone card chrome. */
  embedded?: boolean;
}

const CohortEventsTimeline: React.FC<CohortEventsTimelineProps> = ({ personId, startDate, endDate, embedded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [view, setView] = useState<{ start: number; end: number } | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [hoverTip, setHoverTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const dispatch = useAppDispatch();
  const conceptsState = useAppSelector((s) => s.ive.concepts);

  // Build the dynamic y-axis: for each category, either one row (collapsed) or
  // one row per unique concept_id (expanded). Each row carries enough metadata
  // to remap data points and to handle click-toggle.
  const displayRows = useMemo(() => {
    const rows: {
      ci: number;
      conceptId: string | null;
      label: string;          // rich-text formatted for axis
      plainLabel: string;     // raw label (used for click matching)
      color: string;
    }[] = [];
    CATEGORY_DEFS.forEach((def, ci) => {
      const items = data.filter((d) => d._ci === ci);
      const total = items.length;
      const distinct = new Set(items.map((d) => String(d._conceptId ?? '∅'))).size;

      if (!expanded.has(ci)) {
        rows.push({
          ci,
          conceptId: null,
          plainLabel: def.label,
          label: `{name|${def.label}} {n|${total}} {d|${distinct}}`,
          color: def.color,
        });
        return;
      }
      const seen = new Set<string>();
      items.forEach((d) => seen.add(String(d._conceptId ?? '∅')));
      const cids = Array.from(seen).sort();
      if (cids.length === 0) {
        rows.push({
          ci,
          conceptId: null,
          plainLabel: def.label,
          label: `{name|${def.label}} {n|0}`,
          color: def.color,
        });
        return;
      }
      cids.forEach((cid) => {
        const sub = items.filter((d) => String(d._conceptId ?? '∅') === cid).length;
        const subLabel = `${def.label} #${cid}`;
        rows.push({
          ci,
          conceptId: cid,
          plainLabel: subLabel,
          label: `{sub|${subLabel}} {n|${sub}}`,
          color: def.color,
        });
      });
    });
    return rows;
  }, [data, expanded]);

  const indexLookup = useMemo(() => {
    const m = new Map<string, number>();
    displayRows.forEach((r, i) => m.set(`${r.ci}|${r.conceptId ?? '*'}`, i));
    return m;
  }, [displayRows]);

  const seriesData = useMemo(() => data.map((d) => {
    const cid = expanded.has(d._ci) ? String(d._conceptId ?? '∅') : '*';
    const idx = indexLookup.get(`${d._ci}|${cid}`);
    return idx == null ? d : { ...d, value: [idx, d.value[1]] };
  }), [data, expanded, indexLookup]);

  const chartHeight = GRID_TOP + GRID_BOTTOM + ROW_HEIGHT * Math.max(displayRows.length, 1);

  const displayRowsRef = useRef(displayRows);
  displayRowsRef.current = displayRows;
  const conceptsStateRef = useRef(conceptsState);
  conceptsStateRef.current = conceptsState;

  // Kick off concept-name loads for every distinct concept_id currently visible
  // in an expanded category row. Cached via redux; safe to call repeatedly.
  useEffect(() => {
    displayRows.forEach((r) => {
      if (r.conceptId && r.conceptId !== '∅') loadConcept(dispatch, r.conceptId, conceptsState);
    });
  }, [displayRows, conceptsState, dispatch]);

  const startTs = useMemo(() => new Date(startDate).getTime(), [startDate]);
  const endTs = useMemo(
    () => Math.max(startTs + DAY, new Date(endDate).getTime() + DAY - 1),
    [startTs, endDate],
  );

  // Fetch all categories once for the full range; stream each in as it returns.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setData([]);

    const fromDate = toIsoDate(startTs);
    const toDate = toIsoDate(endTs);
    let pending = CATEGORY_DEFS.length;

    CATEGORY_DEFS.forEach((def, ci) => {
      getOmopRows(def.table, { page: 1, pageSize: 0 }, {
        person_id: personId,
        [def.dateField]: { between: [fromDate, toDate] },
      })
        .then((res) => {
          if (cancelled) return;
          const dateIdx = res.header.indexOf(def.dateColPreferred);
          const fbIdx = res.header.indexOf(def.dateColFallback);

          const rows = res.rows
            .map((row) => {
              const raw = (dateIdx >= 0 ? row[dateIdx] : null) ?? (fbIdx >= 0 ? row[fbIdx] : null);
              if (raw == null || raw === '') return null;
              const ts = new Date(String(raw)).getTime();
              if (!Number.isFinite(ts)) return null;
              const detail: Record<string, unknown> = {};
              res.header.forEach((h, i) => { detail[h] = row[i]; });
              const conceptIdx = res.header.indexOf(def.conceptCol);
              const conceptId = conceptIdx >= 0 ? row[conceptIdx] : null;
              return {
                name: def.label,
                value: [ci, ts],
                itemStyle: { color: def.color },
                _table: def.table,
                _ci: ci,
                _conceptId: conceptId,
                _detail: detail,
              };
            })
            .filter(Boolean) as any[];

          setData((prev) => [...prev.filter((d) => d.value[0] !== ci), ...rows]);
        })
        .finally(() => {
          if (cancelled) return;
          if (--pending === 0) setLoading(false);
        });
    });

    return () => { cancelled = true; };
  }, [startTs, endTs, personId]);

  // Init chart once.
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const renderItem = (params: any, api: any) => {
      const ci = api.value(0);
      const point = api.coord([api.value(1), ci]);
      const height = api.size([0, 1])[1] * 0.4;
      const rect = echarts.graphic.clipRectByRect(
        { x: point[0] - BAR_WIDTH / 2, y: point[1] - height / 2, width: BAR_WIDTH, height },
        { x: params.coordSys.x, y: params.coordSys.y, width: params.coordSys.width, height: params.coordSys.height },
      );
      if (!rect) return;
      const r = BAR_WIDTH / 2;
      return {
        type: 'rect',
        shape: { ...rect, r: [r, r, r, r] },
        style: api.style(),
      };
    };

    setView({ start: startTs, end: endTs });

    chart.setOption({
      tooltip: {
        confine: true,
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        borderWidth: 1,
        textStyle: { color: '#e2e8f0' },
        extraCssText: 'max-width: 360px; white-space: normal; box-shadow: 0 10px 24px rgba(0,0,0,0.5);',
        formatter: (params: any) => {
          const d = params.data || {};
          const detail: Record<string, unknown> = d._detail || {};
          const escape = (v: unknown) =>
            String(v).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
          const fmt = (t: number) => new Date(t).toISOString().replace('T', ' ').slice(0, 19);
          const rows = Object.entries(detail)
            .map(([k, v]) => {
              const empty = v == null || v === '';
              const val = empty
                ? `<span style="color:#475569">—</span>`
                : `<span style="color:#e2e8f0">${escape(v)}</span>`;
              return `<tr><td style="color:#94a3b8;padding-right:8px;font-size:10px">${escape(k)}</td><td style="font-size:10px;font-family:ui-monospace,Menlo,monospace">${val}</td></tr>`;
            })
            .join('');
          return (
            `${params.marker}<b style="color:#f1f5f9">${params.name}</b>` +
            `<span style="color:#94a3b8;margin-left:6px;font-size:10px">${escape(d._table || '')}</span>` +
            `<div style="color:#cbd5e1;font-size:10px;margin:2px 0 6px">${fmt(params.value[1])}</div>` +
            `<table style="border-collapse:collapse">${rows}</table>`
          );
        },
      },
      grid: { left: 140, right: 16, top: GRID_TOP, bottom: GRID_BOTTOM },
      xAxis: {
        type: 'value',
        min: startTs,
        max: endTs,
        scale: true,
        axisLabel: {
          fontSize: 10,
          color: '#94a3b8',
          formatter: (val: number) => {
            const d = new Date(val);
            return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:00`;
          },
        },
        splitLine: { lineStyle: { color: '#e2e8f033' } },
      },
      yAxis: {
        data: CATEGORIES,
        triggerEvent: true,
        axisLabel: {
          fontSize: 10,
          color: '#64748b',
          fontWeight: 600,
          formatter: (v: string) => v,
          rich: {
            name: { color: '#475569', fontWeight: 700, fontSize: 10, padding: [0, 4, 0, 0] },
            sub: { color: '#64748b', fontWeight: 500, fontSize: 9, padding: [0, 4, 0, 0] },
            n: {
              color: '#334155',
              backgroundColor: 'rgba(100, 116, 139, 0.18)',
              padding: [2, 5, 2, 5],
              borderRadius: 8,
              fontSize: 9,
              fontWeight: 700,
            },
            d: {
              color: '#1d4ed8',
              backgroundColor: 'rgba(59, 130, 246, 0.18)',
              padding: [2, 5, 2, 5],
              borderRadius: 8,
              fontSize: 9,
              fontWeight: 700,
            },
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      dataZoom: [
        { type: 'slider', filterMode: 'weakFilter', showDataShadow: false, height: 20, bottom: 16, start: 0, end: 100, labelFormatter: '' },
        { type: 'inside', filterMode: 'weakFilter', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
      ],
      animation: true,
      animationDurationUpdate: 300,
      series: [{
        type: 'custom',
        renderItem,
        itemStyle: { opacity: 0.85 },
        encode: { x: 1, y: 0 },
        animation: false,
        data: [],
      }],
    });

    const onZoom = () => {
      const opt: any = chart.getOption();
      const dz = opt?.dataZoom?.[0];
      if (!dz) return;
      const span = endTs - startTs;
      const s = typeof dz.startValue === 'number' ? dz.startValue : startTs + ((dz.start ?? 0) / 100) * span;
      const e = typeof dz.endValue === 'number' ? dz.endValue : startTs + ((dz.end ?? 100) / 100) * span;
      setView({ start: s, end: e });
    };
    chart.on('datazoom', onZoom);

    // Click on a y-axis label toggles expansion for that category.
    const onAxisClick = (params: any) => {
      if (params.componentType !== 'yAxis' || params.targetType !== 'axisLabel') return;
      const idx = typeof params.dataIndex === 'number' ? params.dataIndex : -1;
      const row = idx >= 0 ? displayRowsRef.current[idx] : null;
      const ci = row
        ? row.ci
        : CATEGORY_DEFS.findIndex((d) => {
            const label = String(params.value ?? '');
            return label === d.label || label.startsWith(`${d.label} #`);
          });
      if (ci < 0) return;
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(ci)) next.delete(ci);
        else next.add(ci);
        return next;
      });
    };
    chart.on('click', onAxisClick);

    const onAxisHover = (params: any) => {
      if (params.componentType !== 'yAxis' || params.targetType !== 'axisLabel') return;
      const idx = typeof params.dataIndex === 'number' ? params.dataIndex : -1;
      const row = idx >= 0 ? displayRowsRef.current[idx] : null;
      if (!row || !row.conceptId || row.conceptId === '∅') {
        setHoverTip(null);
        return;
      }
      const ev = params.event?.event as MouseEvent | undefined;
      const rect = containerRef.current?.getBoundingClientRect();
      const x = ev && rect ? ev.clientX - rect.left : 12;
      const y = ev && rect ? ev.clientY - rect.top : 12;
      const cached = conceptsStateRef.current.byId[String(row.conceptId)];
      const name = cached?.concept_name;
      const text = name
        ? `${name} (${row.conceptId})`
        : `Concept ${row.conceptId}${conceptsStateRef.current.loading[String(row.conceptId)] ? ' · loading…' : ''}`;
      setHoverTip({ x: x + 12, y: y + 12, text });
    };
    const onAxisLeave = (params: any) => {
      if (params.componentType !== 'yAxis' || params.targetType !== 'axisLabel') return;
      setHoverTip(null);
    };
    chart.on('mouseover', onAxisHover);
    chart.on('mouseout', onAxisLeave);

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.off('datazoom', onZoom);
      chart.off('click', onAxisClick);
      chart.off('mouseover', onAxisHover);
      chart.off('mouseout', onAxisLeave);
      chart.dispose();
      chartRef.current = null;
    };
  }, [startTs, endTs]);

  // Update y-axis labels and series data when data or expansion changes.
  // Run on the next frame so the container's new height (driven by displayRows)
  // is committed before chart.resize() recomputes the grid.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const raf = requestAnimationFrame(() => {
      chart.resize();
      chart.setOption({
        yAxis: { data: displayRows.map((r) => r.label) },
        series: [{ data: seriesData }],
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [seriesData, displayRows]);

  const fmtTs = (t: number) => {
    const d = new Date(t);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };
  const spanH = view ? (view.end - view.start) / HOUR : (endTs - startTs) / HOUR;
  const totalH = (endTs - startTs) / HOUR;

  return (
    <div className={embedded ? 'h-full' : 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden'}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
        {!embedded && (
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            Subject Events Timeline
          </span>
        )}
        <span className="text-[10px] text-slate-400 font-mono ml-auto">
          person {personId} ·{' '}
          {view ? `${fmtTs(view.start)} → ${fmtTs(view.end)}` : `${startDate} → ${endDate}`}
          {' · '}{spanH.toFixed(1)}h / {totalH.toFixed(0)}h
          {loading ? ' · loading…' : ` · ${data.length} events`}
        </span>
      </div>
      <div className="relative">
        <div ref={containerRef} className="w-full" style={{ height: chartHeight }} />
        {hoverTip && (
          <div
            className="pointer-events-none absolute z-20 rounded-md border px-2 py-1 text-[11px] shadow-lg"
            style={{
              left: hoverTip.x,
              top: hoverTip.y,
              maxWidth: 320,
              background: '#0f172a',
              borderColor: '#1e293b',
              color: '#e2e8f0',
            }}
          >
            {hoverTip.text}
          </div>
        )}
      </div>
    </div>
  );
};


/* ───────────────── Widget wrapper ───────────────── */

const CohortTimelineWidget: React.FC<WidgetComponentProps<CohortWidgetConfig>> = ({
  title, config, isEditMode, onRemove, onEdit,
}) => (
  <WidgetFrame title={title} isEditMode={isEditMode} onRemove={onRemove} onEdit={onEdit}>
    <CohortEventsTimeline
      embedded
      personId={personOf(config)}
      startDate={config.startDate ?? DEFAULT_START_DATE}
      endDate={config.endDate ?? DEFAULT_END_DATE}
    />
  </WidgetFrame>
);

export default CohortTimelineWidget;
