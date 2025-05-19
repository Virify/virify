declare module '@maptiler/sdk' {
  export interface MapOptions {
    container: HTMLElement | string;
    style: string;
    center?: [number, number];
    zoom?: number;
    interactive?: boolean;
    attributionControl?: boolean;
    dragPan?: boolean;
    scrollZoom?: boolean;
    doubleClickZoom?: boolean;
    touchZoomRotate?: boolean;
    boxZoom?: boolean;
    keyboard?: boolean;
    navigationControl?: boolean;
    geolocateControl?: boolean;
    scaleControl?: boolean;
    fullscreenControl?: boolean;
    [key: string]: any;
  }
  
  export interface PopupOptions {
    offset?: number | [number, number] | { [key: string]: [number, number] };
    closeButton?: boolean;
    className?: string;
    [key: string]: any;
  }
  
  export interface MarkerOptions {
    element?: HTMLElement;
    anchor?: string;
    offset?: [number, number];
    [key: string]: any;
  }
  
  export class Map {
    constructor(options: MapOptions);
    setCenter(center: [number, number]): this;
    setZoom(zoom: number): this;
    resize(): this;
    remove(): void;
    on(event: string, listener: Function): this;
  }
  
  export class Marker {
    constructor(options?: MarkerOptions);
    setLngLat(lngLat: [number, number]): this;
    setPopup(popup: Popup): this;
    addTo(map: Map): this;
    remove(): this;
  }
  
  export class Popup {
    constructor(options?: PopupOptions);
    setLngLat(lngLat: [number, number]): this;
    setHTML(html: string): this;
    setDOMContent(node: HTMLElement): this;
    addTo(map: Map): this;
    remove(): this;
  }
  
  export const config: {
    apiKey: string;
  };
  
  export enum MapStyle {
    STREETS = 'streets',
    OUTDOOR = 'outdoor',
    BASIC = 'basic',
    BRIGHT = 'bright',
    SATELLITE = 'satellite',
    HYBRID = 'hybrid',
    TOPO = 'topo',
    WINTER = 'winter',
    DARK = 'dark'
  }

  export class NavigationControl {
    constructor(options?: { showCompass?: boolean, showZoom?: boolean });
  }

  export class GeolocateControl {
    constructor(options?: { 
      positionOptions?: { enableHighAccuracy?: boolean },
      trackUserLocation?: boolean,
      showAccuracyCircle?: boolean
    });
  }

  export interface IControl {
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
    getDefaultPosition?: () => string;
  }

  export interface Map {
    addControl(control: IControl, position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): this;
    removeControl(control: IControl): this;
    getContainer(): HTMLElement;
    jumpTo(options: { center?: [number, number]; zoom?: number; animate?: boolean }): void;
    resize(): void;
    on(event: string, listener: Function): this;
    off(event: string, listener: Function): this;
    fire(event: string, data?: any): this;
  }
  
  // GeoJSON related types
  export interface GeoJSONFeature {
    type: string;
    geometry: {
      type: string;
      coordinates: any;
    };
    properties?: any;
    id?: string | number;
  }

  // Draw control for creating shapes
  export interface DrawControlOptions {
    displayControlsDefault?: boolean;
    controls?: {
      point?: boolean;
      line_string?: boolean;
      polygon?: boolean;
      trash?: boolean;
      combine_features?: boolean;
      uncombine_features?: boolean;
      rectangle?: boolean;
      circle?: boolean;
    };
    defaultMode?: string;
    styles?: any[];
  }

  export class DrawControl implements IControl {
    constructor(options?: DrawControlOptions);
    getAll(): { features: GeoJSONFeature[] };
    delete(featureIds: string[]): void;
    deleteAll(): void;
    add(feature: GeoJSONFeature): void;
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }
}
