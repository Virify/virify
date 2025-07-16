<template>
  <div class="o-listing-rooms">
    <div class="o-listing-rooms__summary">
      <h3 class="o-listing-rooms__title">Room Summary</h3>
      <div class="o-listing-rooms__stats">
        <div v-if="bedrooms" class="o-listing-rooms__stat">
          <div class="o-listing-rooms__stat-number">{{ bedrooms }}</div>
          <div class="o-listing-rooms__stat-label">Bedroom{{ bedrooms !== 1 ? 's' : '' }}</div>
          <div v-if="bedroomBreakdown" class="o-listing-rooms__stat-breakdown">{{ bedroomBreakdown }}</div>
        </div>
        
        <div v-if="bathrooms" class="o-listing-rooms__stat">
          <div class="o-listing-rooms__stat-number">{{ bathrooms }}</div>
          <div class="o-listing-rooms__stat-label">Bathroom{{ bathrooms !== 1 ? 's' : '' }}</div>
          <div v-if="bathroomBreakdown" class="o-listing-rooms__stat-breakdown">{{ bathroomBreakdown }}</div>
        </div>
        
        <div v-if="receptions" class="o-listing-rooms__stat">
          <div class="o-listing-rooms__stat-number">{{ receptions }}</div>
          <div class="o-listing-rooms__stat-label">Reception{{ receptions !== 1 ? 's' : '' }}</div>
        </div>
        
        <div v-if="otherRooms" class="o-listing-rooms__stat">
          <div class="o-listing-rooms__stat-number">{{ otherRooms }}</div>
          <div class="o-listing-rooms__stat-label">Other Room{{ otherRooms !== 1 ? 's' : '' }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="highlightedRooms.length > 0" class="o-listing-rooms__highlights">
      <h4 class="o-listing-rooms__section-title">Room Highlights</h4>
      <div class="o-listing-rooms__grid">
        <div v-for="room in highlightedRooms" :key="room.id" class="o-listing-rooms__room">
          <div class="o-listing-rooms__room-header">
            <h5 class="o-listing-rooms__room-title">{{ room.title }}</h5>
            <span v-if="room.size" class="o-listing-rooms__room-size">{{ Math.round(room.size) }} m²</span>
          </div>
          <p v-if="room.description" class="o-listing-rooms__room-description">{{ room.description }}</p>
          <div v-if="room.features?.length" class="o-listing-rooms__room-features">
            <AtomsPill v-for="feature in room.features" :key="feature" class="| body-xs">
              {{ feature }}
            </AtomsPill>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bedroom, Bathroom, Reception, Kitchen, LivingArea, Diningroom } from '@prisma/client'
import AtomsPill from '~/components/atoms/AtomsPill.vue'

interface Props {
  bedrooms?: number
  bathrooms?: number
  receptions?: number
  bedroomFeatures?: Bedroom[]
  bathroomFeatures?: Bathroom[]
  receptionFeatures?: Reception[]
  kitchenFeatures?: Kitchen
  livingAreaFeatures?: LivingArea
  diningroomFeatures?: Diningroom
}

const props = defineProps<Props>()

const bedroomBreakdown = computed(() => {
  if (!props.bedroomFeatures?.length) return undefined
  
  const bedTypes = props.bedroomFeatures.reduce((acc, bedroom) => {
    if (bedroom.bed?.length) {
      const hasLarge = bedroom.bed.some(type => ['DOUBLE', 'QUEEN', 'KING', 'SUPER_KING'].includes(type))
      const hasSingle = bedroom.bed.some(type => type === 'SINGLE')
      
      if (hasLarge) acc.large++
      else if (hasSingle) acc.single++
      else acc.other++
    }
    return acc
  }, { large: 0, single: 0, other: 0 })
  
  const parts = []
  if (bedTypes.large > 0) parts.push(`${bedTypes.large} Large`)
  if (bedTypes.single > 0) parts.push(`${bedTypes.single} Single`)
  if (bedTypes.other > 0) parts.push(`${bedTypes.other} Other`)
  
  return parts.join(', ')
})

const bathroomBreakdown = computed(() => {
  if (!props.bathroomFeatures?.length) return undefined
  
  const types = props.bathroomFeatures.reduce((acc, bathroom) => {
    if (bathroom.enSuite) acc.enSuite++
    else acc.main++
    return acc
  }, { enSuite: 0, main: 0 })
  
  const parts = []
  if (types.main > 0) parts.push(`${types.main} Main`)
  if (types.enSuite > 0) parts.push(`${types.enSuite} En-suite`)
  
  return parts.join(', ')
})

const otherRooms = computed(() => {
  let count = 0
  if (props.kitchenFeatures) count++
  if (props.livingAreaFeatures) count++
  if (props.diningroomFeatures) count++
  return count > 0 ? count : undefined
})

const highlightedRooms = computed(() => {
  const rooms = []
  
  // Add largest bedrooms
  if (props.bedroomFeatures?.length) {
    const largestBedrooms = props.bedroomFeatures
      .filter(bedroom => bedroom.size)
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 2)
    
    rooms.push(...largestBedrooms.map(bedroom => ({
      id: `bedroom-${bedroom.id}`,
      title: bedroom.roomNumber ? `Bedroom ${bedroom.roomNumber}` : 'Bedroom',
      size: bedroom.size,
      description: bedroom.description,
      features: [
        ...(bedroom.bed?.map(type => type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())) || []),
        ...(bedroom.enSuite ? ['En-suite'] : []),
        ...(bedroom.builtInStorage ? ['Built-in Storage'] : []),
        ...(bedroom.walkInWardrobe ? ['Walk-in Wardrobe'] : [])
      ].filter(Boolean)
    })))
  }
  
  // Add kitchen if it exists
  if (props.kitchenFeatures) {
    rooms.push({
      id: 'kitchen',
      title: 'Kitchen',
      size: props.kitchenFeatures.size,
      description: props.kitchenFeatures.description,
      features: [
        ...(props.kitchenFeatures.modern ? ['Modern'] : []),
        ...(props.kitchenFeatures.openPlan ? ['Open Plan'] : []),
        ...(props.kitchenFeatures.island ? ['Island'] : []),
        ...(props.kitchenFeatures.breakfastBar ? ['Breakfast Bar'] : [])
      ].filter(Boolean)
    })
  }
  
  // Add living area if it exists
  if (props.livingAreaFeatures) {
    rooms.push({
      id: 'living-area',
      title: 'Living Area',
      size: props.livingAreaFeatures.size,
      description: props.livingAreaFeatures.description,
      features: [
        ...(props.livingAreaFeatures.fireplace ? [`${props.livingAreaFeatures.fireplace.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Fireplace`] : []),
        ...(props.livingAreaFeatures.balcony ? ['Balcony'] : []),
        ...(props.livingAreaFeatures.openPlan ? ['Open Plan'] : [])
      ].filter(Boolean)
    })
  }
  
  return rooms.slice(0, 4) // Limit to 4 highlighted rooms
})
</script>

<style lang="scss">
.o-listing-rooms {
  &__summary {
    margin-bottom: var(--size-32);
  }
  
  &__title {
    margin: 0 0 var(--size-20) 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--foreground-900);
  }
  
  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--size-16);
  }
  
  &__stat {
    text-align: center;
    padding: var(--size-16);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg);
    background: var(--background-300);
  }
  
  &__stat-number {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--primary-600);
    margin-bottom: var(--size-4);
  }
  
  &__stat-label {
    font-weight: 600;
    color: var(--foreground-900);
    margin-bottom: var(--size-4);
  }
  
  &__stat-breakdown {
    font-size: var(--font-size-sm);
    color: var(--foreground-600);
  }
  
  &__section-title {
    margin: 0 0 var(--size-16) 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--foreground-900);
  }
  
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-16);
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  &__room {
    padding: var(--size-20);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg);
    background: var(--background-300);
  }
  
  &__room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-12);
  }
  
  &__room-title {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--foreground-900);
  }
  
  &__room-size {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--foreground-600);
    background: var(--background-200);
    padding: var(--size-4) var(--size-8);
    border-radius: var(--border-radius-md);
  }
  
  &__room-description {
    margin: 0 0 var(--size-12) 0;
    color: var(--foreground-700);
    line-height: 1.5;
  }
  
  &__room-features {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-6);
    
    .a-pill {
      background: var(--secondary-400);
      color: var(--foreground-900);
    }
  }
}
</style>