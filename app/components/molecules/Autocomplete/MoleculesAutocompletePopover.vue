<template>
  <div class="m-autocomplete-popover | flow elevate-200">
    <template v-if="searchValue && !suppressAutocomplete">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Suggestions</h3>

      <MoleculesAutocompleteList v-if="locationSuggestions?.length" :options="locationSuggestions"
        v-slot="{ option, rowClass, actionClass }">
        <button type="button" :class="rowClass" @click.prevent="setLocation(option)">
          {{ option.place_name_en }}
        </button>

        <MoleculesAutocompleteSaveLocation :option :custom-class="actionClass" />
      </MoleculesAutocompleteList>

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        No matches for "{{ searchValue }}"
      </p>
    </template>

    <template v-if="loggedIn">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Saved locations</h3>

      <MoleculesAutocompletePills v-if="entries?.length" :user-saved-locations="entries">
        <template v-slot="{ option }">
          <AtomsButtonPill :content="option.name" variant="ghost" icon="search/pin"
            @click.prevent="setLocationFromSaved(option as UserSavedLocation)" />
        </template>

        <template v-slot:addendum>
          <AtomsButtonPill content="Edit" variant="solid" icon="ai/edit" @click.prevent="updateSavedLocations" />
        </template>
      </MoleculesAutocompletePills>

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        You do not currently have any saved locations
      </p>
    </template>

    <ClientOnly>
      <template v-if="locationHistory.length">
        <h3 class="m-autocomplete-popover__title | title-3xs faded-text">History</h3>

        <MoleculesAutocompleteList :options="locationHistory" v-slot="{ option, rowClass, actionClass }">
          <button type="button" :class="rowClass" @click.prevent="setLocation(option)">
            {{ option.place_name_en }}
          </button>

          <button type="button" aria-label="Remove saved location" :class="actionClass" class="| faded-icon"
            @click.prevent="removeLocationFromHistory(option)">
            <AtomsIcon icon="search/remove" />
          </button>
        </MoleculesAutocompleteList>
      </template>
    </ClientOnly>

    <template v-if="trendingLocations">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Trending locations</h3>

      <MoleculesAutocompletePills :trending-locations="trendingLocations" v-slot="{ option }">
        <AtomsButtonPill :content="option.name" variant="ghost" icon="search/trending" :icon-end="false"
          @click.prevent="setLocationFromTrending(option as TrendingLocation)" />
      </MoleculesAutocompletePills>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogSavedLocations } from '#components';
import type { UserLocation } from '@prisma/client';
const { trendingLocations } = useAnalytics();
const locationSuggestions = ref<GeocodingFeature[]>([]);
const suppressAutocomplete = ref(false);

interface Props {
  searchValue: string
}

const props = defineProps<Props>()

/**
 *  Saved locations
 */
const { loggedIn } = useUserSession();
const { entries, getEntries, clearEntries } = useSavedLocation();

watch(loggedIn, (isAuthenticated) => {
  if (isAuthenticated) {
    getEntries()

    return
  }

  clearEntries()
}, { immediate: true })

/**
 *  Edit saved locations
 */
const { showDialog } = useDialog()

function updateSavedLocations() {
  showDialog({
    component: ViewsDialogSavedLocations
  })
}

/**
 *  History state
 */
const {
  entries: locationHistory,
  addEntry: addLocationToHistory,
  removeEntry: removeLocationFromHistory
} = useLocationHistory()

/**
 *  Set locations
 */
const emits = defineEmits(['location-selected'])

function setLocationFromTrending(option: Partial<TrendingLocation>) {
  const { location } = asObject(option)
  if (location) {
    addLocationToHistory(location as GeocodingFeature)
    emits('location-selected', location)
    suppressAutocomplete.value = true
  }
}

function setLocationFromSaved(option: Partial<UserLocation>) {
  const { geocodingFeature } = asObject(option)

  if (geocodingFeature) {
    addLocationToHistory(geocodingFeature as GeocodingFeature)
    emits('location-selected', geocodingFeature)
    suppressAutocomplete.value = true
  }
}

function setLocation(option: GeocodingFeature) {
  addLocationToHistory(option)
  emits('location-selected', option)
  suppressAutocomplete.value = true
}

/**
 * Autocompletion
 */
const { autoComplete } = useMap();

watch(
  () => props.searchValue,
  async (newVal, oldVal) => {
    // Only reset suppressAutocomplete if the input is cleared
    if (suppressAutocomplete.value && (!newVal || newVal.trim() === '')) {
      suppressAutocomplete.value = false;
      return;
    }
    if (newVal && newVal.trim().length > 2) {
      locationSuggestions.value = await autoComplete(newVal)
    } else {
      locationSuggestions.value = []
    }
  },
  { immediate: true }
)
</script>

<style lang="scss">
.m-autocomplete-popover {
  background-color: var(--background-200);
  padding: var(--size-32);
  border-radius: var(--border-radius-2xl);

  &__title {
    margin-bottom: var(--size-16);

    &:not(:first-of-type) {
      margin-top: var(--size-32);
    }
  }

  &__empty {
    padding: var(--size-16);
    background: var(--background-100);
    border-radius: var(--border-radius-xl);
    text-align: center;
  }
}

.pin--saved {
  color: var(--color-accent, #f39c12); // Use your accent color or any color you want for saved pins
}
</style>