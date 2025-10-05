export type PropertyTypeWithClassifications = {
  id: number
  name: string
  defaultSelected: boolean
  classifications: {
    id: number
    name: string
  }[]
}

export type PropertyTypeOption = {
  key: number
  value: string
}

export type PropertyTypeWithOptions = {
  id: number
  name: string
  defaultSelected: boolean
  options: PropertyTypeOption[]
}