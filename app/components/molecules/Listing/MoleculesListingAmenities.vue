<template>
  <div class="m-listing-amenities">
    <div v-if="isLoading" class="m-listing-amenities__loading">
      Loading nearby amenities...
    </div>
    
    <div v-else-if="error" class="m-listing-amenities__error">
      {{ error }}
    </div>
    
    <div v-else-if="hasNoAmenities" class="m-listing-amenities__empty">
      No nearby amenities found
    </div>
    
    <template v-else>
      <div 
        v-for="[categoryKey, items] in amenityCategories"
        :key="categoryKey"
        class="m-listing-amenities__category"
      >
        <div class="m-listing-amenities__category-header">
          <h3 class="m-listing-amenities__category-title | title-xs">
            {{ formatCategoryKey(categoryKey) }}
          </h3>
        </div>
        
        <ul class="m-listing-amenities__list | body-sm">
          <li v-for="item in items" :key="item.name" class="m-listing-amenities__item">
            <div class="m-listing-amenities__item-icon">
              <AtomsIcon 
                v-if="categoryKey === 'hospitals'" 
                icon="amenities/hospital" 
                :size="16" 
              />
              <AtomsIcon 
                v-else-if="categoryKey === 'schools'" 
                icon="amenities/school" 
                :size="16" 
              />
              <AtomsIcon 
                v-else-if="categoryKey === 'train_stations'" 
                icon="amenities/train" 
                :size="16" 
              />
              <AtomsIcon
                v-else-if="categoryKey === 'bus_stations'" 
                icon="amenities/bus" 
                :size="16" 
              />
              <AtomsIcon
                v-else-if="categoryKey === 'parks'" 
                icon="amenities/park" 
                :size="16" 
              />
              <AtomsIcon
                v-else-if="categoryKey === 'gyms'" 
                icon="amenities/fitness" 
                :size="16" 
              />
            </div>
            <div class="m-listing-amenities__item-content">
              <NuxtLink :to="getMapUrl(item)" external target="_blank" rel="noopener noreferrer">
                {{ item.name }}
              </NuxtLink>
              - <span class="| font-semibold">
                {{ formatDistance(item.distance) }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

interface Props {
  lat: number
  lon: number
  listing?: any
}

interface Emits {
  (e: 'amenities-loaded'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { amenities: groupedAmenities, isLoading, error, fetchAmenities, formatDistance } = useAmenities()

const amenityCategories = computed(() => 
  Object.entries(groupedAmenities.value).filter(([, items]) => 
    Array.isArray(items) && items.length > 0
  )
)

const hasNoAmenities = computed(() => 
  !groupedAmenities.value.schools?.length && 
  !groupedAmenities.value.hospitals?.length && 
  !groupedAmenities.value.train_stations?.length && 
  !groupedAmenities.value.bus_stations?.length && 
  !groupedAmenities.value.parks?.length && 
  !groupedAmenities.value.gyms?.length
)

function formatCategoryKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getMapUrl(item: any) {
  if (item.location?.lat && item.location?.lon) {
    return `https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lon}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`
}

onMounted(async () => {
  if (props.lat && props.lon && props.listing?.property?.id) {
    // Increased radius to 25km (25000m) to ensure hospitals are found in rural/suburban areas
    await fetchAmenities(props.listing.property.id, props.lat, props.lon, 25000)
    emit('amenities-loaded')
  }
})
</script>

<style lang="scss">
.m-listing-amenities {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-16);
  width: 100%;

  &__category {
    background: var(--background-100);
    padding: var(--size-16);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    &-title {
      margin: 0;
      color: var(--foreground-100);
    }
  }

  &__category-header {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    margin-bottom: var(--size-8);
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    color: var(--foreground-100);
    margin-bottom: var(--size-4);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--error);
    flex-shrink: 0;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__item-content {
    flex: 1;

    a {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: var(--secondary-400);
      text-underline-offset: 2px;
    }
  }

  &__loading,
  &__error,
  &__empty {
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