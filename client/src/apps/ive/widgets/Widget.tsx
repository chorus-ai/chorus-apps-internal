import React from 'react';
import type { WidgetConfig } from '../types';
import { getWidget } from './registry';

interface RegistryWidgetProps {
  widget: WidgetConfig;
  isEditMode: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  /** Config values from the hosting page's context (e.g. the selected subject); win over the saved config. */
  overrides?: Record<string, unknown>;
}

/**
 * Generic renderer for registry-backed widgets. Returns null for types not
 * (yet) in WIDGET_REGISTRY so callers can fall back to their legacy switch.
 */
const RegistryWidget: React.FC<RegistryWidgetProps> = ({ widget, isEditMode, onRemove, onEdit, overrides }) => {
  const def = getWidget(widget.type);
  if (!def) return null;
  const config = { ...def.defaults, ...widget.config, ...overrides };
  return (
    <def.Component
      title={widget.title}
      config={config}
      isEditMode={isEditMode}
      onRemove={onRemove}
      onEdit={onEdit}
    />
  );
};

export default RegistryWidget;
