import { createSharedComposable } from "@vueuse/core";
import type { UserLocation } from "@prisma/client";

export const useSavedLocation = createSharedComposable(() => {
  const entries = useState<UserLocation[]>('saved-locations', () => [])

  /**
   *  Get all entries (alias of addEntry, but with no arguments)
   */
  async function getEntries() {
    if (import.meta.server) return

    await $fetch<UserLocation>(`/api/user/locations/`).then((response) => {
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

  async function addEntry(newLocation: UserLocation) {
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
    await $fetch<UserLocation>(`/api/user/locations/`, {
      method: "POST",
      body: newLocation,
    }).then(() => {
      entries.value.push(newLocation)
    }).catch(() => {
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
  function checkEntry(location: Partial<UserLocation>) {
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
  function deleteEntry(entry: Partial<UserLocation>) {
    console.log('Delete entry', entry)
  }

  return {
    entries,
    getEntries,
    checkEntry,
    clearEntries,
    deleteEntry,
    addEntry
  }
});
