/**
 * Map drawing styles for MapTiler SDK
 */

export const drawingStyles = [
  // Vertex points style (dots while drawing)
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 6,
      "circle-color": "#fff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#8CC6F0",
    },
  },
  // Active vertex points (selected points)
  {
    id: "gl-draw-polygon-and-line-vertex-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 7,
      "circle-color": "#fff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#326C96",
    },
  },
  // Midpoints for drawing (smaller dots between vertices)
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "meta", "midpoint"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    paint: {
      "circle-radius": 4,
      "circle-color": "#fff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#8CC6F0",
    },
  },
  // Polygon fill
  {
    id: "gl-draw-polygon",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#8CC6F0",
      "fill-outline-color": "#326C96",
      "fill-opacity": 0.15,
    },
  },
  // Polygon outline (dotted)
  {
    id: "gl-draw-polygon-stroke",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "line-color": "#326C96",
      "line-width": 2,
      "line-dasharray": [3, 2],
    },
  },
  // Active polygon outline (dotted, brighter)
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"], ["==", "active", "true"]],
    paint: {
      "line-color": "#8CC6F0",
      "line-dasharray": [3, 2],
      "line-width": 2,
    },
  },
];

// Export as 'styles' for backward compatibility
export const styles = drawingStyles;