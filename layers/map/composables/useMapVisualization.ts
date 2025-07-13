import type { ExtendedMapTilerMap } from "~~/shared/types/map";

export function useMapVisualization() {
  /**
   * Updates or adds a circle to visualize the search radius as an SVG overlay (no tile requests)
   *
   * @param map The map instance
   * @param center The center coordinates [lon, lat]
   * @param radiusMiles The radius in miles
   */
  function updateSearchRadiusVisualization(map: ExtendedMapTilerMap, center: [number, number], radiusMiles: number) {
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

    // Helper to update the circle position/size
    function drawCircle() {
      // Get map size
      const width = mapContainer.offsetWidth;
      const height = mapContainer.offsetHeight;
      (svgOverlay as SVGSVGElement).setAttribute("width", width.toString());
      (svgOverlay as SVGSVGElement).setAttribute("height", height.toString());

      // Project center to pixel coordinates
      const mapAny = map as any; // project exists at runtime
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

      // Clear previous SVG content
      (svgOverlay as SVGSVGElement).innerHTML = "";
      // Draw the circle
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

    drawCircle();

    // Redraw on move/zoom/resize
    function onMove() {
      drawCircle();
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