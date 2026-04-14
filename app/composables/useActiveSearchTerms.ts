interface ActiveSearchTerms {
  location: string | null
  radius: number | null
  terms: string[]
}

export function useActiveSearchTerms() {
  const state = useState<ActiveSearchTerms>('active-search-state', () => reactive({
    location: null,
    radius: null,
    terms: []
  }))

  /**
   *  Set location string
   */
  function setActiveLocation(location?: unknown | null) {
    const { place_name_en, place_name } = asObject(location)

    // Get first matching location name
    const locationString = place_name_en || place_name

    // Ensure is a string
    if (isString(locationString)) {
      state.value.location = locationString

      return
    }

    state.value.location = ''
  }

  /**
   *  Set radius number
   */
  function setActiveRadius(radius?: number | null) {
    if (!radius && radius !== 0) radius = 0

    state.value.radius = radius
  }

  /**
   *  Set terms string array
   */
  function setActiveTerms(terms: unknown[] = []) {
    console.log({ terms })

    if (!Array.isArray(terms)) terms = []

    // Format terms as uppercase string
    const validTerms = terms.filter(isString).map((term: string) => {
      return term.charAt(0).toUpperCase() + term.slice(1)
    })

    state.value.terms = validTerms
  }

  return readonly({
    location: computed(() => state.value.location),
    radius: computed(() => state.value.radius),
    terms: computed(() => state.value.terms),
    setActiveLocation,
    setActiveRadius,
    setActiveTerms
  })
}