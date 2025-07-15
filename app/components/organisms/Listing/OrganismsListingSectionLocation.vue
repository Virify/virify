<template>
  <div class="o-listing-section-location | flow flow-lg">
    <div class="o-listing-section-location__grid" role="presentation">
      <div class="o-listing-section-location__amenities">
        <div v-if="groupedAmenities.schools.length > 0" class="o-listing-section-location__category">
          <h5 class="o-listing-section-location__category-title | title-xs">Schools</h5>
          <ul class="o-listing-section-location__list">
            <li v-for="school in groupedAmenities.schools" :key="school.name">
              {{ school.name }} - {{ formatDistance(school.distance) }}
            </li>
          </ul>
        </div>

        <div v-if="groupedAmenities.hospitals.length > 0" class="o-listing-section-location__category">
          <h5 class="o-listing-section-location__category-title | title-xs">Hospitals</h5>
          <ul class="o-listing-section-location__list">
            <li v-for="hospital in groupedAmenities.hospitals" :key="hospital.name">
              {{ hospital.name }} - {{ formatDistance(hospital.distance) }}
            </li>
          </ul>
        </div>

        <div v-if="groupedAmenities.shops.length > 0" class="o-listing-section-location__category">
          <h5 class="o-listing-section-location__category-title | title-xs">Shops</h5>
          <ul class="o-listing-section-location__list">
            <li v-for="shop in groupedAmenities.shops" :key="shop.name">
              {{ shop.name }} - {{ formatDistance(shop.distance) }}
            </li>
          </ul>
        </div>

        <div v-if="isLoading" class="o-listing-section-location__loading">
          Loading nearby amenities...
        </div>

        <div v-else-if="error" class="o-listing-section-location__error">
          {{ error }}
        </div>

        <div v-else-if="!groupedAmenities.schools.length && !groupedAmenities.hospitals.length && !groupedAmenities.shops.length" 
             class="o-listing-section-location__empty">
          No nearby amenities found
        </div>
      </div>

      <Map v-if="lat && lon" :center="[lon, lat]" :zoom="12" :interactive="false"
        :marker="mapMarker" class="o-listing-section-location__map" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  lat: number
  lon: number
  listing?: any
  amenities?: any[] | null
}

const props = defineProps<Props>()

const mapMarker = computed(() => props.listing)

const { amenities, isLoading, error, fetchAmenities, formatDistance } = useAmenities()

// Convert database amenities to grouped format
const groupedAmenities = computed(() => {
  if (props.amenities && Array.isArray(props.amenities) && props.amenities.length > 0) {
    return {
      schools: props.amenities.filter(a => a.type === 'EDUCATION').map(a => ({
        name: a.name,
        distance: a.distanceM,
        type: 'schools'
      })),
      hospitals: props.amenities.filter(a => a.type === 'HEALTHCARE').map(a => ({
        name: a.name,
        distance: a.distanceM,
        type: 'hospitals'
      })),
      shops: props.amenities.filter(a => a.type === 'SHOPPING_ENTERTAINMENT').map(a => ({
        name: a.name,
        distance: a.distanceM,
        type: 'shops'
      }))
    }
  }
  // Use amenities from composable if no prop provided
  return amenities.value
})

// Fetch amenities if not provided as prop
onMounted(async () => {
  if (!props.amenities || !Array.isArray(props.amenities) || props.amenities.length === 0) {
    if (props.lat && props.lon && props.listing?.property?.id) {
      await fetchAmenities(props.listing.property.id, props.lat, props.lon, 5000)
    }
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
    height: min(20em, 50vh);
  }

  &__amenities {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &__category {
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