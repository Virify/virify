<template>
  <div class="v-dialog-saved-locations | flow dialog-container dialog-container-xs">
    <h2 class="| title-sm">Saved locations</h2>

    <ul v-if="entries.length" class="v-dialog-saved-locations__list | flow">
      <li v-for="entry of entries" :key="entry.id">
        <MoleculesAutocompleteEditSavedLocation :entry />
      </li>
    </ul>

    <p v-else class="v-dialog-saved-locations__empty">
      You do not yet have any saved locations
    </p>
  </div>
</template>

<script setup lang="ts">
const { entries } = useSavedLocation();
</script>

<style lang="scss">
.v-dialog-saved-locations {
  background-color: var(--background-200);

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>