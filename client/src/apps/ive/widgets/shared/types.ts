import type React from 'react';
import type { WidgetType } from '../../types';

export type HeightPreset = 'auto' | 'sm' | 'md' | 'lg';

/**
 * Executable request template stored in a widget's config. {{param}}
 * placeholders are filled from the widget's live fields at fetch time
 * (URI-encoded in the endpoint, JSON-encoded in the body), so the saved
 * spec is exactly what the widget executes.
 */
export interface RequestSpec {
  endpoint: string;
  method?: 'GET' | 'POST';
  body?: string;
}

export type WidgetCategory = 'cohort' | 'person' | 'visit' | 'chart' | 'generic';

/**
 * Props every widget component receives from the generic renderer.
 * `config` is `def.defaults` merged with the saved `widget.config`, so
 * widgets can read it without null checks on individual defaults.
 */
export interface WidgetComponentProps<C = Record<string, unknown>> {
  title: string;
  config: C;
  isEditMode: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}

/** Props every settings panel receives from WidgetSettingsModal. */
export interface WidgetSettingsProps<C = Record<string, unknown>> {
  config: C;
  onChange: (next: C) => void;
  widgetType: WidgetType;
}

/** A pre-configured entry shown in the creator modal's Widget Library tab. */
export interface WidgetPreset<C = Record<string, unknown>> {
  title: string;
  description?: string;
  layout?: { w: number; h: HeightPreset };
  config?: Partial<C>;
}

/**
 * The store listing for one widget: everything the workspace needs to
 * render, configure, and offer it. One definition per catalog folder,
 * registered once in `widgets/registry.ts`.
 */
export interface WidgetDefinition<C = Record<string, unknown>> {
  type: WidgetType;
  label: string;
  description: string;
  /** Material Symbols icon name. */
  icon: string;
  category: WidgetCategory;
  defaultLayout: { w: number; h: HeightPreset };
  Component: React.FC<WidgetComponentProps<C>>;
  Settings?: React.FC<WidgetSettingsProps<C>>;
  defaults?: Partial<C>;
  validate?: (config: C) => string[];
  /**
   * Pre-configured examples. Doubles as the AI-assembly context: presets
   * (and the built-in layouts) carry explicit `request` templates, so an
   * agent learns each widget's data access from runnable configs rather
   * than prose metadata.
   */
  presets?: WidgetPreset<C>[];
}
