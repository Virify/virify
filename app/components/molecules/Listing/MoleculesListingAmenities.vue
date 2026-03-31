<template>
  <div class="m-listing-amenities">
    <div v-for="[categoryKey, items] in amenityCategories" :key="categoryKey" class="m-listing-amenities__category">
      <div class="m-listing-amenities__category-header">
        <h3 class="m-listing-amenities__category-title | title-xs">
          {{ formatCategoryKey(categoryKey) }}
        </h3>
      </div>

      <ul class="m-listing-amenities__list | body-sm">
        <li v-for="item in items" :key="item.name" class="m-listing-amenities__item">
          <div class="m-listing-amenities__item-icon">
            <AtomsIcon v-if="categoryKey === 'hospitals'" icon="amenities/hospital" :size="16" />
            <AtomsIcon v-else-if="categoryKey === 'schools'" icon="amenities/school" :size="16" />
            <AtomsIcon v-else-if="categoryKey === 'train_stations'" icon="amenities/train" :size="16" />
            <AtomsIcon v-else-if="categoryKey === 'bus_stations'" icon="amenities/bus" :size="16" />
            <AtomsIcon v-else-if="categoryKey === 'parks'" icon="amenities/park" :size="16" />
            <AtomsIcon v-else-if="categoryKey === 'gyms'" icon="amenities/fitness" :size="16" />
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
  </div>
</template>

<script setup lang="ts">
import type { Amenities } from '~~/layers/database/server/database/prisma/generated/client'

interface Props {
  lat: number
  lon: number
  listing?: any
  amenities: Amenities[]
}

const props = defineProps<Props>()

const amenityCategories = computed(() => {
  const grouped: {
    schools: any[],
    hospitals: any[],
    train_stations: any[],
    bus_stations: any[],
    parks: any[],
    gyms: any[]
  } = {
    schools: [],
    hospitals: [],
    train_stations: [],
    bus_stations: [],
    parks: [],
    gyms: []
  }

  props.amenities.forEach(amenity => {
    if (amenity.type === 'EDUCATION' && amenity.subtype === 'SCHOOL') {
      grouped.schools.push({
        name: amenity.name,
        distance: amenity.distanceM,
        location: amenity.location
      })
    } else if (amenity.type === 'HEALTHCARE' && amenity.subtype === 'HOSPITAL') {
      grouped.hospitals.push({
        name: amenity.name,
        distance: amenity.distanceM,
        location: amenity.location
      })
    } else if (amenity.type === 'TRANSPORT' && amenity.subtype === 'TRAIN_STATION') {
      grouped.train_stations.push({
        name: amenity.name,
        distance: amenity.distanceM,
        location: amenity.location
      })
    } else if (amenity.type === 'TRANSPORT' && amenity.subtype === 'BUS_STOP') {
      grouped.bus_stations.push({
        name: amenity.name,
        distance: amenity.distanceM,
        location: amenity.location
      })
    } else if (amenity.type === 'GREEN_SPACE' && amenity.subtype === 'PARK') {
      grouped.parks.push({
        name: amenity.name,
        distance: amenity.distanceM,
        location: amenity.location
      })
    } else if (amenity.type === 'SHOPPING_ENTERTAINMENT' && amenity.subtype === 'GYM') {
      grouped.gyms.push({
        name: amenity.name,
        distance: amenity.distanceM,
        location: amenity.location
      })
    }
  })

  return Object.entries(grouped).filter(([, items]) => items.length > 0)
})

function formatCategoryKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatDistance(meters: number) {
  const miles = meters / 1609.34
  return `${miles.toFixed(1)} miles`
}

function getMapUrl(item: any) {
  if (item.location?.lat && item.location?.lon) {
    return `https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lon}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`
}
</script>


<style lang="scss">
@use "#styles/_utils/media" as mq;

.m-listing-amenities {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-16);
  width: 100%;

  @include mq.mobile-and-small-tablet {
    grid-template-columns: 1fr;
  }


  &__category {
    background: var(--background-200);
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
      text-decoration-color: var(--primary-400);
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
    color: var(--error-500);
  }

  &__empty {
    color: var(--foreground-400);
  }
}
</style>