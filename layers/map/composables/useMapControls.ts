import type { NavigationControl, GeolocateControl } from '@maptiler/sdk'
type ControlPositions = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/**
 * Map controls utilities for managing map interactivity and navigation
 * controls
 */
export function useMapControls(mapInstance: MapInstance) {
  const sdk = useMapSDK();
  const map = mapInstance.map

  /**
   * Validate whether an input is a NavigationControl
   */
  function _isNavigationControl(arg: unknown): arg is NavigationControl {
    return arg instanceof sdk.NavigationControl
  }

  /**
   * Validate whether an input is a GeolocateControl
   */
  function _isGeolocateControl(arg: unknown): arg is GeolocateControl {
    return arg instanceof sdk.GeolocateControl
  }

  /**
   * Validate whether an input is a control
   */
  function _isControl(arg: NavigationControl): arg is NavigationControl
  function _isControl(arg: GeolocateControl): arg is GeolocateControl
  function _isControl(arg: unknown): boolean {
    return _isNavigationControl(arg) || _isGeolocateControl(arg)
  }

  /**
   * Set map controls and interactivity based on options
   */
  function setControls(newOptions: MapOptions): boolean | void {
    const prevInteractive = mapInstance.interactive;
    const newInteractive = newOptions.interactive;
    const controls = asArray(map._controls);

    if (prevInteractive !== newInteractive) {
      if (newInteractive) {
        enableControls()

        // Check if controls are wanted
        const hasNavControl = controls.some(_isNavigationControl);
        const hasGeoControl = controls.some(_isGeolocateControl);

        // Only add controls if they don't exist
        if (!hasNavControl) {
          map.addControl(new sdk.NavigationControl() as any, "bottom-right");
        }
        if (!hasGeoControl) {
          map.addControl(new sdk.GeolocateControl() as any, "bottom-right");
        }
      } else {
        disableControls()
        removeControls()
      }

      mapInstance.interactive = newInteractive;

      return newInteractive;
    }
  }

  /**
   * Enable all map interactions
   */
  function enableControls() {
    map.dragPan.enable();
    map.scrollZoom.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();
    map.keyboard.enable();
    map.boxZoom.enable();
  }

  /**
   * Disable all map interactions
   */
  function disableControls() {
    map.dragPan.disable();
    map.scrollZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.keyboard.disable();
    map.boxZoom.disable();
  }

  /**
   * Add navigation control to map
   */
  function addControl(position: ControlPositions = 'top-right') {
    map.addControl(new sdk.NavigationControl() as IControl, position);
  }

  /**
   * Remove navigation and geolocation controls from map
   */
  function removeControls() {
    for (const control of asArray(map._controls)) {
      if (_isControl(control)) {
        map.removeControl(control);
      }
    }
  }

  return {
    setControls,
    enableControls,
    disableControls,
    addControl,
    removeControls
  }
}