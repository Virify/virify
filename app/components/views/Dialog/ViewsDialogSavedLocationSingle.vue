<template>
  <div class="v-dialog-saved-location-single | flow dialog-container dialog-container-xs">
    <h2 class="v-dialog-saved-location-single__title | title-sm">Edit saved location</h2>

    <div v-if="entry" class="v-dialog-saved-location-single__body | flow flow-sm">
      <MoleculesAutocompleteEditSavedLocation :entry="entry" @updated="onUpdated" @deleted="onDeleted" />
    </div>

    <p v-else class="v-dialog-saved-location-single__empty | body-sm faded-text">Location not found.</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  entry?: UserSavedLocation;
}
const props = defineProps<Props>();
const entry = computed(() => props.entry);
const { showToast } = useToast();
const { hideDialog } = useDialog();

function onUpdated(name: string) {
  showToast('Location updated', { type: 'success' })
  hideDialog?.({ returnValue: { updated: true, name } })
}

function onDeleted() {
  showToast('Location deleted', { type: 'success' })
  hideDialog?.({ returnValue: { deleted: true } })
}
</script>

<style lang="scss">
.v-dialog-saved-location-single {
  background-color: var(--background-100);

  &__title {
    margin: 0;
  }

  &__empty {
    margin: 0;
  }
}
</style>
