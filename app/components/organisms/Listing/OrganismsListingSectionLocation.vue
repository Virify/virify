<template>
  <div class="o-listing-section-location | flow flow-lg">
    <div class="o-listing-section-location__grid" role="presentation">
      <div class="o-listing-section-location__amenities">
        <template v-for="([key, items], idx) in Object.entries(groupedAmenities)" :key="key">
          <div v-if="Array.isArray(items) && items.length > 0" class="o-listing-section-location__category | box">
            <button
              class="o-listing-section-location__category-toggle"
              :aria-expanded="!isCategoryCollapsed(key)"
              @click="setCategoryCollapsed(key, !isCategoryCollapsed(key))"
            >
              <span class="o-listing-section-location__category-title | title-xs">{{ formatCategoryKey(key) }}</span>
              <span class="o-listing-section-location__category-arrow" aria-hidden="true">
                <svg v-if="isCategoryCollapsed(key)" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><path d="M7 13L11 9L7 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><path d="M5 7L9 11L13 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </button>
            <transition name="fade">
              <ul v-if="!isCategoryCollapsed(key)" class="o-listing-section-location__list">
                <li v-for="item in items" :key="item.name">
                  <a
                    :href="item.location && item.location.lat && item.location.lon
                      ? `https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lon}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ item.name }}
                  </a>
                  - {{ formatDistance(item.distance) }}
                </li>
              </ul>
            </transition>
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

      <Map v-if="lat && lon" ref="mapRef" :center="[lon, lat]" :zoom="12" :interactive="false" :marker="mapMarker"
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

const mapRef = ref()
const mapMarker = computed(() => props.listing)

function formatCategoryKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const { amenities: groupedAmenities, isLoading, error, fetchAmenities, formatDistance, isCategoryCollapsed, setCategoryCollapsed } = useAmenities()

onMounted(async () => {
  if (props.lat && props.lon && props.listing?.property?.id) {
    await fetchAmenities(props.listing.property.id, props.lat, props.lon, 5000)
    
    // Recenter map after amenities are loaded (content has changed the layout)
    nextTick(() => {
      if (mapRef.value?.recenterMap) {
        setTimeout(() => {
          mapRef.value.recenterMap()
        }, 100)
      }
    })
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
      margin: 0;
      color: var(--foreground-700);
    }
  }

  &__category-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: var(--size-8);
    font: inherit;
  }

  &__category-arrow {
    font-size: 1.2em;
    line-height: 1;
    display: flex;
    align-items: center;
    margin-left: var(--size-8);
  }

  &__list {
    a {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: var(--secondary-400);
      text-underline-offset: 2px;
    }
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      font-size: var(--text-sm);
      color: var(--foreground-600);
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