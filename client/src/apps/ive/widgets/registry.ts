import type { WidgetType } from '../types';
import type { WidgetDefinition } from './shared/types';
import demographics from './catalog/demographics/definition';
import personDemographics from './catalog/person-demographics/definition';
import personStats from './catalog/person-stats/definition';
import cohortTimeline from './catalog/cohort-timeline/definition';
import personTopConcepts from './catalog/person-top-concepts/definition';
import personMeasurements from './catalog/person-measurements/definition';
import waveform from './catalog/waveform/definition';
import measurementTrend from './catalog/measurement-trend/definition';
import alarmScore from './catalog/alarm-score/definition';
import alarmTimeline from './catalog/alarm-timeline/definition';
import vitalsMonitor from './catalog/vitals-monitor/definition';
import imageSeries from './catalog/image-series/definition';
import labsDotplot from './catalog/labs-dotplot/definition';
import clinicalNote from './catalog/clinical-note/definition';
import patientProfile from './catalog/patient-profile/definition';
import domainTable from './catalog/domain-table/definition';
import condition from './catalog/condition/definition';
import timeline from './catalog/timeline/definition';
import stats from './catalog/stats/definition';
import table from './catalog/table/definition';
import { barChart, lineChart, pieChart } from './catalog/chart/definition';
import radarChart from './catalog/radar-chart/definition';
import organTrajectory from './catalog/organ-trajectory/definition';
import interventionSuggestions from './catalog/intervention-suggestions/definition';
import medicationAdherence from './catalog/medication-adherence/definition';
import adherenceTrend from './catalog/adherence-trend/definition';
import tableCard from './catalog/table-card/definition';
import visitHeader from './catalog/visit-header/definition';
import visitCost from './catalog/visit-cost/definition';

/**
 * The widget store: one entry per catalog folder. Adding a widget =
 * create `catalog/<name>/{definition.ts,<Name>Widget.tsx,<Name>Settings.tsx}`
 * and register the definition here. The renderer (widgets/Widget.tsx),
 * the settings modal, and the creator modal's library all read this map,
 * so a registered widget is immediately renderable, configurable, and
 * offered in the Add Widget picker.
 *
 * Every WidgetType is registered here; the renderer returns null for any
 * type missing from the map. The WidgetType union in types.ts is kept in
 * sync by hand (it can't be derived here without a circular import).
 */
export const WIDGET_REGISTRY = {
  demographics,
  person_demographics: personDemographics,
  person_stats: personStats,
  cohort_timeline: cohortTimeline,
  person_top_concepts: personTopConcepts,
  person_measurements: personMeasurements,
  waveform,
  measurement_trend: measurementTrend,
  alarm_score: alarmScore,
  alarm_timeline: alarmTimeline,
  vitals_monitor: vitalsMonitor,
  image_series: imageSeries,
  labs_dotplot: labsDotplot,
  clinical_note: clinicalNote,
  patient_profile: patientProfile,
  domain_table: domainTable,
  condition,
  timeline,
  stats,
  table,
  bar_chart: barChart,
  line_chart: lineChart,
  pie_chart: pieChart,
  radar_chart: radarChart,
  organ_trajectory: organTrajectory,
  intervention_suggestions: interventionSuggestions,
  medication_adherence: medicationAdherence,
  adherence_trend: adherenceTrend,
  table_card: tableCard,
  visit_header: visitHeader,
  visit_cost: visitCost,
} satisfies Partial<Record<WidgetType, WidgetDefinition<any>>>;

export function getWidget(type: WidgetType): WidgetDefinition<any> | undefined {
  return (WIDGET_REGISTRY as Partial<Record<WidgetType, WidgetDefinition<any>>>)[type];
}

/**
 * Serializable catalog of every registered widget — the context an AI/agent
 * needs to assemble a layout from a prompt. Data access is taught by
 * example: presets carry explicit, executable `request` templates. Feed the
 * result (as JSON) into the prompt; validate the model's proposed
 * WidgetConfig[] with each definition's `validate` before rendering.
 */
export function describeRegistry() {
  return Object.values(WIDGET_REGISTRY).map((def: WidgetDefinition<any>) => ({
    type: def.type,
    label: def.label,
    description: def.description,
    category: def.category,
    defaultLayout: def.defaultLayout,
    defaults: def.defaults,
    presets: def.presets?.map(({ title, description, config }) => ({ title, description, config })),
  }));
}
