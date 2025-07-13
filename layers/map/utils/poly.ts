/**
 * Polygon drawing utilities for SVG-based map visualizations
 */

/**
 * Helper to draw polygon shapes (both Polygon and MultiPolygon)
 */
export function drawPolygonShape(svg: SVGSVGElement, mapAny: any, polygon: any) {
  if (!polygon) return;

  const coordinates = polygon.coordinates;
  
  if (polygon.type === "Polygon") {
    // Single polygon
    drawSinglePolygon(svg, mapAny, coordinates);
  } else if (polygon.type === "MultiPolygon") {
    // Multiple polygons - draw each one
    coordinates.forEach((polygonCoords: number[][][]) => {
      drawSinglePolygon(svg, mapAny, polygonCoords);
    });
  }
}

/**
 * Helper to draw a single polygon
 */
export function drawSinglePolygon(svg: SVGSVGElement, mapAny: any, coordinates: number[][][]) {
  coordinates.forEach((ring, index) => {
    const points = ring.map(coord => {
      const px = mapAny.project([coord[0], coord[1]]);
      return `${px.x},${px.y}`;
    }).join(' ');

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", "#326C96");
    polygon.setAttribute("fill-opacity", index === 0 ? "0.15" : "0"); // Fill exterior, hollow interior rings
    polygon.setAttribute("stroke", "#326C96");
    polygon.setAttribute("stroke-width", "2");
    polygon.setAttribute("stroke-opacity", "0.4");
    svg.appendChild(polygon);
  });
}

/**
 * Clear all polygon visualizations from the SVG
 */
export function clearPolygonVisualizations(svg: SVGSVGElement) {
  const polygons = svg.querySelectorAll("polygon");
  polygons.forEach(polygon => polygon.remove());
}

/**
 * Draw a circle visualization for radius-based searches
 */
export function drawCircleVisualization(svg: SVGSVGElement, mapAny: any, center: [number, number], radiusMiles: number) {
  const centerPoint = mapAny.project(center);
  
  // Convert miles to meters for calculation
  const radiusMeters = radiusMiles * 1609.34;
  
  // Calculate radius in pixels (approximate)
  const metersPerPixel = 156543.03392 * Math.cos(center[1] * Math.PI / 180) / Math.pow(2, mapAny.getZoom());
  const radiusPixels = radiusMeters / metersPerPixel;

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", centerPoint.x.toString());
  circle.setAttribute("cy", centerPoint.y.toString());
  circle.setAttribute("r", radiusPixels.toString());
  circle.setAttribute("fill", "#326C96");
  circle.setAttribute("fill-opacity", "0.15");
  circle.setAttribute("stroke", "#326C96");
  circle.setAttribute("stroke-width", "2");
  circle.setAttribute("stroke-opacity", "0.4");
  
  svg.appendChild(circle);
}

/**
 * Clear all circle visualizations from the SVG
 */
export function clearCircleVisualizations(svg: SVGSVGElement) {
  const circles = svg.querySelectorAll("circle");
  circles.forEach(circle => circle.remove());
}