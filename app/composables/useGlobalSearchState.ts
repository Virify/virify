import { createSharedComposable } from '@vueuse/core'

/**
 *  @TODO - maybe move this to a better location, or improve the import
 *          aliasing to be less brittle
 */
import type { FormState } from '../components/organisms/TraditionalSearch/OrganismsTraditionalSearchForm.vue'

type SortOrder =
  'relevance' |
  'price-asc' |
  'price-desc' |
  'date-desc' |
  'date-asc'

type TraditionalFormData = Partial<FormState>

interface SearchState {
  type: 'ai' | 'traditional'
  location: GeocodingFeature | null,
  radius: number
  sortOrder: SortOrder
  traditional: TraditionalFormData | null
  ai: string | null
}

type NewState = Omit<SearchState, 'traditional' | 'ai'> & {
  query?: string | TraditionalFormData
}

const useGlobalSearchState = createSharedComposable(() => {
  const state = useState<SearchState>('global-search-state', () => ({
    type: 'ai',
    location: null,
    radius: 0,
    sortOrder: 'relevance',
    traditional: null,
    ai: null
  }))

  /**
   *  Toggle search type
   */
  function setType(type: 'ai' | 'traditional') {
    if (type === 'ai') {
      state.value.type = 'ai'

      return
    }

    state.value.type = 'traditional'
  }

  /**
   *  Update location
   */
  function setLocation(location: GeocodingFeature) {
    state.value.location = location
  }

  /**
   *  Update radius
   */
  function setRadius(radius: number | string) {
    state.value.radius = Number(radius) || 0
  }

  /**
   *  Update search query
   */
  function setFormData(formData: TraditionalFormData | string, type = state.value.type) {
    if (type === 'ai') {
      state.value.ai = formData as string

      return
    }

    state.value.traditional = formData as TraditionalFormData
  }

  /**
   *  Update search query
   */
  function setSortOrder(sortOrder: SortOrder) {
    state.value.sortOrder = sortOrder
  }

  /**
   *  Set entire state
   */
  function setState(newState: Partial<NewState>) {
    const { type, location, radius, sortOrder, query } = asObject(newState)

    if (type) setType(type)
    if (location) setLocation(location)
    if (radius) setRadius(radius)
    if (sortOrder) setSortOrder(sortOrder)
    if (query) setFormData(query, type)
  }

  /**
   *  Get body for a fetch request
   */
  function getFetchBody() {
    return JSON.stringify({
      type: state.value.type,
      location: state.value.location,
      radius: state.value.radius,
      query: state.value.type === 'ai'
        ? state.value.ai
        : state.value.traditional
    })
  }

  /**
   *  Get location, radius in a human-readable format
   */
  const location = computed<string | null>(() => {
    const { location } = asObject(state.value)
    const { place_name_en, place_name } = asObject(location)

    if (!isString(place_name_en || place_name)) {
      return null
    }

    return (place_name_en || place_name) as string
  })

  /**
   *  Get radius
   */
  const radius = computed<number>(() => {
    const { radius } = asObject(state.value)

    return Number(radius) || 0
  })

  return {
    state,
    location,
    radius,
    setType,
    setState,
    setLocation,
    setRadius,
    setFormData,
    setSortOrder,
    getFetchBody
  }
})


export default useGlobalSearchState