export type PropertyTypeWithClassifications = {
  id: number
  name: string
  defaultSelected: boolean
  classifications: {
    id: number
    name: string
  }[]
}