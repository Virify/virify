<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h2 class="| title-sm">Saved locations</h2>

    <ul v-if="entriesFormatted.length" class="v-dialog-saved-locations__list | flow">
      <li v-for="{ id, name, location } of entriesFormatted" :key="id">
        <MoleculesAutocompleteEditSavedLocation :id :name :location />
      </li>
    </ul>

    <p v-else class="v-dialog-saved-locations__empty">
      You do not yet have any saved locations
    </p>
  </div>
</template>

<script setup lang="ts">
const { entries } = useSavedLocation();

const entriesFormatted = computed(() => {
  if (!Array.isArray(entries.value)) return []

  return entries.value.map((entry) => {
    const { name, id, geocodingFeature } = asObject(entry)
    const { place_name_en } = asObject(geocodingFeature)

    return {
      id,
      name,
      location: place_name_en
    } as { id: number, name: string, location: string }
  })
})
</script>

<style lang="scss">
.v-dialog-saved-locations {

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>