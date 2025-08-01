<template>
  <div v-if="listings.length > 0" class="m-similar-listings | flow flow-sm">
    <h2 class="title-md">Similar Properties ({{ listings.length }})</h2>
    <div class="m-similar-listings__carousel-wrapper">
      <MoleculesCarousel
        ref="carouselRef"
        :slides="listings"
        slide-size="280px"
        gap="var(--size-16)"
        :loop="false"
        :show-arrows="false"
        :options="{ slidesToScroll: 1 }"
        class="m-similar-listings__carousel"
      >
        <template #default="{ slide }">
          <MoleculesSummaryCard :listing="slide" :address="slide.address" class="m-similar-listings__card" />
        </template>
      </MoleculesCarousel>
      <div class="m-similar-listings__arrows">
        <button
          class="embla-prev"
          @click="scrollPrev"
          :disabled="!canScrollPrev"
        >
          <AtomsIcon icon="chevron-left" :size="24" />
        </button>
        <button
          class="embla-next"
          @click="scrollNext"
          :disabled="!canScrollNext"
        >
          <AtomsIcon icon="chevron-right" :size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ listings: any[]; address: any }>();
const carouselRef = ref();

const canScrollPrev = computed(() => carouselRef.value?.canScrollPrev?.());
const canScrollNext = computed(() => carouselRef.value?.canScrollNext?.());
const scrollPrev = () => carouselRef.value?.scrollPrev?.();
const scrollNext = () => carouselRef.value?.scrollNext?.();
</script>

<style lang="scss">
.m-similar-listings__carousel-wrapper {
  display: flex;
  flex-direction: column;
}

.m-similar-listings__arrows {
  display: flex;
  gap: var(--size-8);
  margin-top: var(--size-12);
  align-items: center;
  justify-content: flex-start;
}

/* Use embla arrow styles from carousel */
.embla-prev,
.embla-next {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 2;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.7);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.m-similar-listings {
  padding-bottom: var(--size-32);
}

.m-similar-listings__carousel {
  margin-top: var(--size-16);
}

.m-similar-listings__card {
  height: calc(100% - 3px);
  /* Avoid flex stretch constraint issues */

  .popup-wrapper {
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .listing-card {
    width: 100%;
    max-width: none;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
