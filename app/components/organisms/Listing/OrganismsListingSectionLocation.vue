<template>
  <div class="o-listing-section-location | flow flow-lg">
    <div class="o-listing-section-location__grid" role="presentation">
      <div class="o-listing-section-location__amenities">
        <template v-for="([key, items], idx) in Object.entries(groupedAmenities)" :key="key">
          <div v-if="Array.isArray(items) && items.length > 0" class="o-listing-section-location__category | box">
            <h5 class="o-listing-section-location__category-title | title-xs">{{ formatCategoryKey(key) }}</h5>
            <ul class="o-listing-section-location__list">
              <li v-for="item in items" :key="item.name">
                {{ item.name }} - {{ formatDistance(item.distance) }}
              </li>
            </ul>
          </div>
        </template>

        <div v-if="isLoading" class="o-listing-section-location__loading">
          Loading nearby amenities...
        </div>

        <div v-else-if="error" class="o-listing-section-location__error">
          {{ error }}
        </div>

        <div
          v-else-if="!groupedAmenities.schools.length && !groupedAmenities.hospitals.length && !groupedAmenities.train_stations.length"
          class="o-listing-section-location__empty">
          No nearby amenities found
        </div>
      </div>

      <Map v-if="lat && lon" :center="[lon, lat]" :zoom="12" :interactive="false" :marker="mapMarker"
        class="o-listing-section-location__map" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  lat: number
  lon: number
  listing?: any
}

const props = defineProps<Props>()

const mapMarker = computed(() => props.listing)

function formatCategoryKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const { amenities: groupedAmenities, isLoading, error, fetchAmenities, formatDistance } = useAmenities()

onMounted(async () => {
  if (props.lat && props.lon && props.listing?.property?.id) {
    await fetchAmenities(props.listing.property.id, props.lat, props.lon, 5000)
  }
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-listing-section-location {
  &__grid {
    display: grid;
    grid-gap: var(--size-16);

    @include mq.small-tablet {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__map {
    border-radius: var(--border-radius-2xl);
    height: min(40em, 100vh);
  }

  &__amenities {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &__category {
    background: var(--background-300);
    &-title {
      margin: 0 0 var(--size-8) 0;
      color: var(--foreground-700);
    }
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      font-size: var(--text-sm);
      color: var(--foreground-600);
      border-bottom: 1px solid var(--border-color, #e5e7eb);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &__loading,
  &__error,
  &__empty {
    font-size: var(--text-sm);
    font-style: italic;
  }

  &__loading {
    color: var(--foreground-500);
  }

  &__error {
    color: var(--danger-500, #ef4444);
  }

  &__empty {
    color: var(--foreground-400);
  }
}
</style>