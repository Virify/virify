/**
 * Drawing mode type (simplified for our current needs)
 */
export type DrawingMode = 'polygon' | null;

/**
 * Shape drawn event interface
 */
export interface ShapeDrawnEvent {
  feature: GeoJSONFeature;
  type: Exclude<DrawingMode, null>;
}
