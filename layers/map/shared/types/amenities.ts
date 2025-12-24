import type { AmenityType, AmenitySubtype } from "~~/layers/database/server/database/prisma/generated/enums"

  export interface Amenity {
    name: string
    distance: number
    type: string
  }

  export interface Amenities {
    schools: Amenity[]
    hospitals: Amenity[]
    train_stations: Amenity[]
    bus_stations: Amenity[]
    parks: Amenity[]
    gyms: Amenity[]
  }

  export interface AmenityData {
  type: AmenityType
  subtype?: AmenitySubtype
  name: string
  distanceM: number
  description?: string | null
  location?: any
}
