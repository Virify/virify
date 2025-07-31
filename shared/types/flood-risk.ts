export type FloodWarning = {
  '@id': string
  floodAreaID: string
  description: string
  eaAreaName: string
  message: string
  severity: string
  severityLevel: number
  timeMessageChanged: string
  timeRaised: string
}

export type FloodStation = {
  '@id': string
  RLOIid: string
  catchmentName: string
  dateOpened: string
  label: string
  lat: number
  long: number
  measures: any[]
  notation: string
  riverName: string
  stageScale: any
  stationReference: string
  status: string
  town: string
  type: string[]
}

export type FloodApiResponse = {
  '@context': string
  meta: any
  items: FloodWarning[]
}

export type StationApiResponse = {
  '@context': string
  meta: any
  items: FloodStation[]
}

export type HistoricalFloodEvent = {
  id: string | number
  startDate: string
  endDate?: string
  floodSource: string
  floodCause: string
  surfaceArea: number
  floodTypes: {
    fluvial: boolean
    coastal: boolean
    tidal: boolean
  }
  name: string
  comments?: string
}

export type FloodEventsSummary = {
  totalEvents: number
  averageFloodedArea: number
  floodSources: string[]
  mostRecentEvent: HistoricalFloodEvent
  timespan: string
}