export function useMapVisualization() {
  /**
   * Updates or adds a visualization to show the search area as an SVG overlay (no tile requests)
   *
   * @param map The map instance
   * @param center The center coordinates [lon, lat]
   * @param radiusMiles The radius in miles
   * @param bbox Optional bounding box for exact location searches [west, south, east, north]
   * @param boundaryPolygon Optional actual boundary polygon geometry
   */
  function updateSearchRadiusVisualization(map: ExtendedMapTilerMap, center: [number, number], radiusMiles: number, bbox?: [number, number, number, number], boundaryPolygon?: any) {
    // Remove any existing SVG overlay
    const mapContainer = map.getContainer();
    let svgOverlay = mapContainer.querySelector(".search-radius-svg") as SVGSVGElement | null;
    if (svgOverlay) {
      // Cleanup listeners if present
      if ((svgOverlay as any)._cleanup) (svgOverlay as any)._cleanup();
      svgOverlay.remove();
    }

    // Create SVG overlay
    svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.classList.add("search-radius-svg");
    svgOverlay.style.position = "absolute";
    svgOverlay.style.top = "0";
    svgOverlay.style.left = "0";
    svgOverlay.style.width = "100%";
    svgOverlay.style.height = "100%";
    svgOverlay.style.pointerEvents = "none";
    mapContainer.appendChild(svgOverlay);

    // Helper to update the visualization
    function drawVisualization() {
      // Get map size
      const width = mapContainer.offsetWidth;
      const height = mapContainer.offsetHeight;
      (svgOverlay as SVGSVGElement).setAttribute("width", width.toString());
      (svgOverlay as SVGSVGElement).setAttribute("height", height.toString());

      // Clear previous SVG content
      (svgOverlay as SVGSVGElement).innerHTML = "";

      const mapAny = map as any; // project exists at runtime

      // For "this location only", prioritize actual boundary polygon, then bbox, then circle
      if (radiusMiles === 0 && boundaryPolygon) {
        // Draw the actual boundary polygon shape
        drawPolygonShape(svgOverlay as SVGSVGElement, mapAny, boundaryPolygon);
      } else if (radiusMiles === 0 && bbox) {
        // Draw the boundary rectangle  
        const [west, south, east, north] = bbox;
        
        // Project bbox corners to pixel coordinates
        const topLeftPx = mapAny.project([west, north]);
        const bottomRightPx = mapAny.project([east, south]);
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", topLeftPx.x.toString());
        rect.setAttribute("y", topLeftPx.y.toString());
        rect.setAttribute("width", (bottomRightPx.x - topLeftPx.x).toString());
        rect.setAttribute("height", (bottomRightPx.y - topLeftPx.y).toString());
        rect.setAttribute("fill", "#326C96");
        rect.setAttribute("fill-opacity", "0.15");
        rect.setAttribute("stroke", "#326C96");
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("stroke-opacity", "0.4");
        (svgOverlay as SVGSVGElement).appendChild(rect);
      } else {
        // Draw circle for radius-based searches
        const centerPx = mapAny.project(center);

        // Calculate radius in meters
        const radiusMeters = radiusMiles * 1609.34;
        // Calculate pixel radius at current zoom
        // Use a point due east of center at the radius distance
        const earthRadius = 6378137;
        const dLng = ((radiusMeters / (earthRadius * Math.cos((Math.PI * center[1]) / 180))) * 180) / Math.PI;
        const edgeLng = center[0] + dLng;
        const edgePx = mapAny.project([edgeLng, center[1]]);
        const pixelRadius = Math.abs(edgePx.x - centerPx.x);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", centerPx.x.toString());
        circle.setAttribute("cy", centerPx.y.toString());
        circle.setAttribute("r", pixelRadius.toString());
        circle.setAttribute("fill", "#326C96");
        circle.setAttribute("fill-opacity", "0.15");
        circle.setAttribute("stroke", "#326C96");
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("stroke-opacity", "0.4");
        (svgOverlay as SVGSVGElement).appendChild(circle);
      }
    }

    // Helper to draw polygon shapes (both Polygon and MultiPolygon)
    function drawPolygonShape(svg: SVGSVGElement, mapAny: any, polygon: any) {
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

    // Helper to draw a single polygon
    function drawSinglePolygon(svg: SVGSVGElement, mapAny: any, coordinates: number[][][]) {
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

    drawVisualization();

    // Redraw on move/zoom/resize
    function onMove() {
      drawVisualization();
    }
    map.on("move", onMove);
    map.on("zoom", onMove);
    window.addEventListener("resize", onMove);

    // Store cleanup for this overlay
    (svgOverlay as any)._cleanup = () => {
      map.off("move", onMove);
      map.off("zoom", onMove);
      window.removeEventListener("resize", onMove);
    };
  }

  /**
   * Removes the SVG overlay for the search radius visualization (and cleans up listeners)
   * @param map The map instance
   */
  function removeSearchRadiusVisualization(map: ExtendedMapTilerMap) {
    if (!map || !map.getContainer) return;
    const mapContainer = map.getContainer();
    const svgOverlay = mapContainer.querySelector(".search-radius-svg") as SVGSVGElement | null;
    if (svgOverlay) {
      if ((svgOverlay as any)._cleanup) (svgOverlay as any)._cleanup();
      svgOverlay.remove();
    }
  }

  return {
    updateSearchRadiusVisualization,
    removeSearchRadiusVisualization,
  } as const;
}