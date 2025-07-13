/**
 * Map controls utilities for managing map interactivity and navigation controls
 */

/**
 * Set map controls and interactivity based on options
 *
 * @param existingMapInstance The cached map instance
 * @param map The map object
 * @param options MapOptions
 * @returns boolean | void
 */
export function setControls(existingMapInstance: MapInstance, map: ExtendedMapTilerMap, options: MapOptions): boolean | void {
  const prevInteractive = existingMapInstance.interactive;
  const newInteractive = options.interactive;
  const sdk = useNuxtApp().$maptilersdk;
  const controls = map._controls ?? [];

  if (prevInteractive !== newInteractive) {
    if (newInteractive) {
      map.dragPan.enable();
      map.scrollZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
      map.keyboard.enable();
      map.boxZoom.enable();
      
      // Only add controls if they don't exist
      const hasNavControl = controls.some((c: any) => c instanceof sdk.NavigationControl);
      const hasGeoControl = controls.some((c: any) => c instanceof sdk.GeolocateControl);
      
      if (!hasNavControl) {
        const navControl = new sdk.NavigationControl() as any;
        map.addControl(navControl, "bottom-right");
      }
      if (!hasGeoControl) {
        const geolocateControl = new sdk.GeolocateControl() as any;
        map.addControl(geolocateControl, "bottom-right");
      }
    } else {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
      map.keyboard.disable();
      map.boxZoom.disable();
      
      // Remove controls when disabling interactivity
      for (const control of controls) {
        if (control instanceof sdk.NavigationControl || control instanceof sdk.GeolocateControl) {
          map.removeControl(control as any);
        }
      }
    }
    existingMapInstance.interactive = newInteractive;
    return newInteractive;
  }
}

/**
 * Enable all map interactions
 * 
 * @param map The map object
 */
export function enableAllControls(map: ExtendedMapTilerMap) {
  map.dragPan.enable();
  map.scrollZoom.enable();
  map.doubleClickZoom.enable();
  map.touchZoomRotate.enable();
  map.keyboard.enable();
  map.boxZoom.enable();
}

/**
 * Disable all map interactions
 * 
 * @param map The map object
 */
export function disableAllControls(map: ExtendedMapTilerMap) {
  map.dragPan.disable();
  map.scrollZoom.disable();
  map.doubleClickZoom.disable();
  map.touchZoomRotate.disable();
  map.keyboard.disable();
  map.boxZoom.disable();
}

/**
 * Add navigation control to map
 * 
 * @param map The map object
 * @param position Position for the control
 */
export function addNavigationControl(map: ExtendedMapTilerMap, position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right') {
  const sdk = useNuxtApp().$maptilersdk;
  const navControl = new sdk.NavigationControl() as any;
  map.addControl(navControl, position);
}

/**
 * Remove navigation and geolocation controls from map
 * 
 * @param map The map object
 */
export function removeNavigationControl(map: ExtendedMapTilerMap) {
  const sdk = useNuxtApp().$maptilersdk;
  const controls = map._controls ?? [];
  for (const control of controls) {
    if (control instanceof sdk.NavigationControl || control instanceof sdk.GeolocateControl) {
      map.removeControl(control as any);
    }
  }
}