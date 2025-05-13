export type PropertyTypeWIthClassifications = {
  id: number
  name: string
  defaultSelected: boolean
  classifications: {
    id: number
    name: string
  }[]
}