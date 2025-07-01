import { createSharedComposable } from "@vueuse/core";
import type { UserLocation } from "@prisma/client";

export const useSavedLocation = createSharedComposable(() => {
  const entries = useState<UserLocation[]>('saved-locations', () => [])

  /**
   *  Get all entries
   */
  function getEntries() {
    return addEntry()
  }

  /**
   * Fetch location entries
   */
  async function addEntry(newLocation?: Record<string, any>) {
    await $fetch<UserLocation>(`/api/user/locations/`, {
      method: "POST",
      body: newLocation,
    }).then((response) => {
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
   * Check if an entry exists
   */
  function checkEntry(location: unknown) {
    const { place_name_en } = asObject(location)

    return entries.value.find((entry) => {
      return entry.location === place_name_en
    });
  }

  /**
   * Remove a location entry
   */
  function deleteEntry() {
    console.log('Delete entry')
  }

  return {
    entries,
    getEntries,
    checkEntry,
    deleteEntry,
    addEntry
  }
});
