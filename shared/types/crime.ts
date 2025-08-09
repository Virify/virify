export type CrimeIncident = {
  category: string
  location_type: string
  location: {
    latitude: string
    longitude: string
    street: {
      id: number
      name: string
    }
  }
  context: string
  outcome_status: {
    category: string
    date: string
  } | null
  persistent_id: string
  id: number
  location_subtype: string
  month: string
}

export type CrimeCategory = {
  url: string
  name: string
}

export type CrimeCategoryGroup = {
  category: string
  count: number
  incidents: CrimeIncident[]
}

export type CrimeScore = {
  score: number
  level: string
  description: string
}

export type StatCard = {
  title: string
  value: string
  description: string
  icon: string
}