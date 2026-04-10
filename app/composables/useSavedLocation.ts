import { createSharedComposable } from "@vueuse/core";

export const useSavedLocation = createSharedComposable(() => {
  const entries = useState<UserSavedLocation[]>('saved-locations', () => [])
  const toast = useToast()

  /**
   *  Get all entries (alias of addEntry, but with no arguments)
   */
  async function getEntries() {
    if (import.meta.server) return

    await $fetch<UserSavedLocation>(`/api/user/locations/`).then((response) => {
      if (!Array.isArray(response)) {
        throw createError({
          status: 500,
          statusMessage: 'Invalid response from server'
        })
      }

      entries.value = response
    })
  }

  /**
   * Fetch location entries
   */
  const isPending = ref(false)

  async function addEntry(newLocation: UserSavedLocation) {
    if (isPending.value) return

    // Ensure a location is provided
    if (!newLocation) {
      throw createError({
        status: 400,
        statusMessage: 'No location provided'
      })
    }

    // Prevent multiple locations being saved at the same time
    isPending.value = true

    // Post new location
    await $fetch<UserSavedLocation>(`/api/user/locations/`, {
      method: "POST",
      body: newLocation,
    }).then(async () => {
      // Refresh entries
      await getEntries()
      toast.add({ title: 'Location saved', color: 'success', icon: 'i-lucide-map-pin' })
    }).catch(() => {
      toast.add({ title: 'Error', description: 'Failed to save location', color: 'error', icon: 'i-lucide-map-pin-off' })
      throw createError({
        status: 500,
        statusMessage: 'Unable to save new location'
      })
    }).finally(() => {
      // Re-allow location saving
      isPending.value = false
    })
  }

  /**
   * Check if an entry exists
   */
  function checkEntry(location: GeocodingFeature) {
    const { place_name_en } = asObject(location)

    return entries.value.find((entry) => {
      return entry.location === place_name_en
    });
  }

  /**
   *  Clear entries
   */
  function clearEntries() {
    entries.value = []
  }

  /**
   * Remove a location entry
   */
  async function deleteEntry(entryId: number) {
    if (!Number.isInteger(entryId)) {
      console.error('Entry ID is not a number')

      return
    }

    await $fetch<UserSavedLocation>(`/api/user/locations/${entryId}`, {
      method: "DELETE"
    }).then(async () => {
      await getEntries()
      toast.add({ title: 'Location removed', color: 'success', icon: 'i-lucide-map-pin-off' })
    }).catch(() => {
      toast.add({ title: 'Error', description: 'Failed to remove location', color: 'error', icon: 'i-lucide-map-pin-off' })
    })
  }

  /**
   * Update only the name of an existing entry
   */
  async function updateEntryName(entryId: number, name: string) {
    if (!Number.isInteger(entryId) || !name?.length) return
    await $fetch<UserSavedLocation>(`/api/user/locations/`, {
      method: 'PATCH',
      body: { id: entryId, name }
    }).then(async () => {
      await getEntries()
      toast.add({ title: 'Location name updated', color: 'success', icon: 'i-lucide-map-pin' })
    }).catch(() => {
      toast.add({ title: 'Error', description: 'Failed to update location name', color: 'error', icon: 'i-lucide-map-pin-off' })
      throw createError({ status: 500, statusMessage: 'Unable to update location name' })
    })
  }

  return {
    entries,
    getEntries,
    checkEntry,
    clearEntries,
    deleteEntry,
    addEntry,
    updateEntryName
  }
});
