import type { WidgetDefinition } from '../../shared/types';
import ImageSeriesWidget, { ImageSeriesConfig } from './widget';

const imageSeries: WidgetDefinition<ImageSeriesConfig> = {
  type: 'image_series',
  label: 'Images',
  description: 'Imaging study viewer with a thumbnail series (sample X-ray until DICOM integration)',
  icon: 'radiology',
  category: 'person',
  defaultLayout: { w: 3, h: 'lg' },
  Component: ImageSeriesWidget,
};

export default imageSeries;
