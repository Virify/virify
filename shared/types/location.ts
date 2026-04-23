export type AddressLocation = {
  lat: number;
  lon: number;
};

export type SearchLocation = {
  lat: number;
  lon: number;
  boundaryPolygon?: any;
  bbox?: [number, number, number, number];
  radius?: number;
};
