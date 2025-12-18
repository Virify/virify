<template>
  <div v-if="pending" class="o-relevant-listings | flow flow-sm">
    <h2 class="title-md">{{ loadingMessage }}</h2>
  </div>
  
  <div v-else-if="error" class="o-relevant-listings | flow flow-sm">
    <h2 class="title-md">{{ errorMessage }}</h2>
  </div>
  
  <div v-else-if="listings && listings.length > 0" class="o-relevant-listings | flow flow-sm">
    <h2 class="title-md">{{ dynamicTitle }} {{ type === 'similar' ? `(${listings.length})` : '' }}</h2>
    <div class="o-relevant-listings__carousel-wrapper">
      <MoleculesCarousel
        ref="carouselRef"
        :slides="listings"
        slide-size="280px"
        gap="var(--size-12)"
        :loop="false"
        :show-arrows="false"
        :options="{ slidesToScroll: 1 }"
        class="o-relevant-listings__carousel"
      >
        <template #default="{ slide }">
          <MoleculesSummaryCard :listing="slide" :address="slide.address" class="o-relevant-listings__card" />
        </template>
      </MoleculesCarousel>
      <div class="o-relevant-listings__arrows">
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
interface Props {
  listingId?: string;
  address?: any;
  type?: 'similar' | 'trending';
  title?: string;
  days?: number;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'similar',
  title: '',
  days: 7,
  limit: 12
});

const carouselRef = ref();

// Build API URL based on type
const apiUrl = computed(() => {
  if (props.type === 'trending') {
    const params = new URLSearchParams();
    if (props.days) params.append('days', props.days.toString());
    if (props.limit) params.append('limit', props.limit.toString());
    return `/api/listings/trending?${params.toString()}`;
  } else {
    return `/api/listings/${props.listingId}/similar`;
  }
});

// Dynamic title based on type
const dynamicTitle = computed(() => {
  if (props.title) return props.title;
  return props.type === 'trending' ? 'Trending Properties' : 'Similar Properties';
});

// Dynamic loading message
const loadingMessage = computed(() => {
  return props.type === 'trending' ? 'Loading Trending Properties...' : 'Loading Similar Properties...';
});

// Dynamic error message
const errorMessage = computed(() => {
  return props.type === 'trending' ? 'Unable to load trending properties' : 'Unable to load similar properties';
});

// Fetch listings based on the computed URL
const { data: listings, pending, error } = await useFetch<any[]>(apiUrl.value);

const canScrollPrev = computed(() => carouselRef.value?.canScrollPrev?.());
const canScrollNext = computed(() => carouselRef.value?.canScrollNext?.());
const scrollPrev = () => carouselRef.value?.scrollPrev?.();
const scrollNext = () => carouselRef.value?.scrollNext?.();
</script>

<style lang="scss">
.o-relevant-listings__carousel-wrapper {
  display: flex;
  flex-direction: column;
}

.o-relevant-listings__arrows {
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

.o-relevant-listings {
  padding-bottom: var(--size-16);
}

.o-relevant-listings__card {
  height: calc(100% - 3px);
  /* Avoid flex stretch constraint issues */

  .popup-wrapper {
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .summary-card {
    width: 100%;
    max-width: none;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
