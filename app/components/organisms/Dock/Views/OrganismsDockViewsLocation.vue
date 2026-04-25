<template>
  <div class="o-dock-views-location | flow">
    <MoleculesAiSearchLoading v-if="pending" />

    <template v-else>
      <h2 class="| title-md">Location</h2>

      <MoleculesAiSearchFormLocation />

      <button @click.prevent="updateLocationOnMap" class="o-dock-views-location__button | button button-secondary">
        Search
        <AtomsIcon icon="arrow-right" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
const { pending } = useFetchResults()

const emits = defineEmits(['location-selected'])

function updateLocationOnMap() {
  emits('location-selected')
}
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-dock-views-location__button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-8);
  margin: var(--size-24) 0 0 auto;
  padding-right: var(--size-18);
  padding-left: var(--size-24);
  text-align: center;
  width: 100%;

  @include mq.tablet {
    width: fit-content;
  }

  .a-icon {
    display: block;
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>
