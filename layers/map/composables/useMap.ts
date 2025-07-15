import { useMapConfig } from "./useMapConfig";
import { useMapMarkers } from "./useMapMarkers";
import { useMapDraw } from "./useMapDraw";
import { useMapSearch } from "./useMapSearch";
import { useMapVisualization } from "./useMapVisualization";

export function useMap() {
  // Initialize all specialized composables
  const { initMap, getMapCache, GLOBAL_MAP_ID } = useMapConfig();
  const mapCache = getMapCache();
  
  const { 
    addMarker, 
    addMarkers, 
    addMarkersForFeature, 
    clearMarkers, 
    clearMarkersForFeature 
  } = useMapMarkers(mapCache);
  
  const { 
    initDrawing, 
    getDrawControl, 
    togglePolygonDrawing, 
    deleteAllShapes, 
    deleteSelectedShape, 
    getBBox, 
    setBBox, 
    clearBBox,
    drawingState,
    polygonGeometries
  } = useMapDraw(mapCache);
  
  const { autoComplete, geocodeAndSelectBest, enhanceWithBoundaryPolygon } = useMapSearch();
  const { updateSearchRadiusVisualization, removeSearchRadiusVisualization } = useMapVisualization();

  // Wrap draw functions to pass required dependencies
  const wrappedInitDrawing = (map: any, draw: boolean) => {
    initDrawing(map, draw, clearMarkers, removeSearchRadiusVisualization, clearMarkersForFeature);
  };
  
  const wrappedDeleteAllShapes = (map: any) => {
    deleteAllShapes(map, clearMarkers, clearMarkersForFeature);
  };
  
  const wrappedDeleteSelectedShape = (map: any) => {
    deleteSelectedShape(map, clearMarkersForFeature);
  };

  return {
    // Map initialization
    initMap,
    GLOBAL_MAP_ID,
    
    // Marker management
    addMarkers,
    addMarker,
    clearMarkers,
    clearMarkersForFeature,
    addMarkersForFeature,
    
    // Drawing functionality
    initDrawing: wrappedInitDrawing,
    getDrawControl,
    togglePolygonDrawing,
    deleteAllShapes: wrappedDeleteAllShapes,
    deleteSelectedShape: wrappedDeleteSelectedShape,
    drawingState: readonly(drawingState),
    polygonGeometries: readonly(polygonGeometries),
    getBBox,
    setBBox,
    clearBBox,
    
    // Search functionality
    autoComplete,
    geocodeAndSelectBest,
    enhanceWithBoundaryPolygon,
    
    // Visualization
    updateSearchRadiusVisualization,
    removeSearchRadiusVisualization,
    
    // Utilities
    calculateZoomLevelFromRadius,
  } as const;
}
