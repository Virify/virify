<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="isLoading" />

    <template v-else>
      <h2 class="| title-md">Location</h2>

      <MoleculesAiSearchFormLocation @location-selected="updateLocationOnMap" />
    </template>
  </div>
</template>

<script setup lang="ts">
const { isLoading } = useSearchState()

const emits = defineEmits(['location-selected'])

function updateLocationOnMap() {
  emits('location-selected')
}
</script>
