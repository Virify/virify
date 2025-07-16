<template>
  <div class="o-listing-features-highlight">
    <div class="o-listing-features-highlight__grid">
      <div v-if="keyFeatures.length > 0" class="o-listing-features-highlight__section">
        <h3 class="o-listing-features-highlight__title">Key Features</h3>
        <div class="o-listing-features-highlight__tags">
          <AtomsPill v-for="feature in keyFeatures" :key="feature" class="o-listing-features-highlight__tag--key | body-xs">
            {{ feature }}
          </AtomsPill>
        </div>
      </div>
      
      <div v-if="amenityFeatures.length > 0" class="o-listing-features-highlight__section">
        <h3 class="o-listing-features-highlight__title">Amenities</h3>
        <div class="o-listing-features-highlight__tags">
          <AtomsPill v-for="feature in amenityFeatures" :key="feature" class="o-listing-features-highlight__tag--amenity | body-xs">
            {{ feature }}
          </AtomsPill>
        </div>
      </div>
      
      <div v-if="outdoorFeatures.length > 0" class="o-listing-features-highlight__section">
        <h3 class="o-listing-features-highlight__title">Outdoor & Parking</h3>
        <div class="o-listing-features-highlight__tags">
          <AtomsPill v-for="feature in outdoorFeatures" :key="feature" class="o-listing-features-highlight__tag--outdoor | body-xs">
            {{ feature }}
          </AtomsPill>
        </div>
      </div>
      
      <div v-if="securityFeatures.length > 0" class="o-listing-features-highlight__section">
        <h3 class="o-listing-features-highlight__title">Security & Safety</h3>
        <div class="o-listing-features-highlight__tags">
          <AtomsPill v-for="feature in securityFeatures" :key="feature" class="o-listing-features-highlight__tag--security | body-xs">
            {{ feature }}
          </AtomsPill>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { 
  AdditionalFeatures, 
  OutdoorSpace, 
  Parking, 
  Security, 
  Storage, 
  Accessibility,
  Kitchen,
  LivingArea
} from '@prisma/client'
import AtomsPill from '~/components/atoms/AtomsPill.vue'

interface Props {
  additionalFeatures?: AdditionalFeatures
  outdoorSpace?: OutdoorSpace
  parking?: Parking
  security?: Security
  storage?: Storage
  accessibility?: Accessibility
  kitchen?: Kitchen
  livingArea?: LivingArea
}

const props = defineProps<Props>()

const keyFeatures = computed(() => {
  const features = []
  
  // Kitchen features
  if (props.kitchen?.modern) features.push('Modern Kitchen')
  if (props.kitchen?.openPlan) features.push('Open Plan Kitchen')
  if (props.kitchen?.island) features.push('Kitchen Island')
  if (props.kitchen?.breakfastBar) features.push('Breakfast Bar')
  
  // Living area features
  if (props.livingArea?.fireplace) {
    const fireplace = props.livingArea.fireplace.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    features.push(`${fireplace} Fireplace`)
  }
  if (props.livingArea?.openPlan) features.push('Open Plan Living')
  if (props.livingArea?.balcony) features.push('Balcony')
  
  // Additional features
  if (props.additionalFeatures?.petFriendly) features.push('Pet Friendly')
  if (props.additionalFeatures?.homeOffice) features.push('Home Office')
  if (props.additionalFeatures?.pool) features.push('Swimming Pool')
  if (props.additionalFeatures?.gym) features.push('Gym')
  if (props.additionalFeatures?.concierge) features.push('Concierge')
  
  // Storage features
  if (props.storage?.attic) features.push('Attic Storage')
  if (props.storage?.basement) features.push('Basement')
  if (props.storage?.separateDressing) features.push('Separate Dressing Room')
  
  return features.slice(0, 8) // Limit to 8 key features
})

const amenityFeatures = computed(() => {
  const features = []
  
  if (props.additionalFeatures?.internet) features.push('Internet')
  if (props.additionalFeatures?.cableTv) features.push('Cable TV')
  if (props.additionalFeatures?.phone) features.push('Phone')
  if (props.additionalFeatures?.laundry) features.push('Laundry')
  if (props.additionalFeatures?.shop) features.push('Shop')
  
  return features
})

const outdoorFeatures = computed(() => {
  const features = []
  
  // Outdoor space
  if (props.outdoorSpace?.frontGarden) features.push('Front Garden')
  if (props.outdoorSpace?.rearGarden) features.push('Rear Garden')
  if (props.outdoorSpace?.sunTerrace) features.push('Sun Terrace')
  if (props.outdoorSpace?.terrace) features.push('Terrace')
  if (props.outdoorSpace?.patio) features.push('Patio')
  if (props.outdoorSpace?.shed) features.push('Shed')
  if (props.outdoorSpace?.summerHouse) features.push('Summer House')
  if (props.outdoorSpace?.gardenOffice) features.push('Garden Office')
  
  // Parking
  if (props.parking?.garage) features.push('Garage')
  if (props.parking?.driveway) features.push('Driveway')
  if (props.parking?.carport) features.push('Carport')
  if (props.parking?.evCharging) features.push('EV Charging')
  if (props.parking?.allocatedParking) features.push('Allocated Parking')
  
  return features
})

const securityFeatures = computed(() => {
  const features = []
  
  if (props.security?.gatedCommunity) features.push('Gated Community')
  if (props.security?.cctv) features.push('CCTV')
  if (props.security?.alarmSystem) features.push('Alarm System')
  if (props.security?.intercomSystem) features.push('Intercom System')
  if (props.security?.neighborhoodWatch) features.push('Neighborhood Watch')
  if (props.security?.security) features.push('Security')
  if (props.security?.reception) features.push('Reception')
  
  // Accessibility features
  if (props.accessibility?.wheelchairFriendly) features.push('Wheelchair Friendly')
  if (props.accessibility?.stepFreeAccess) features.push('Step-free Access')
  if (props.accessibility?.elevator) features.push('Elevator')
  if (props.accessibility?.accessibleParking) features.push('Accessible Parking')
  
  return features
})
</script>

<style lang="scss">
.o-listing-features-highlight {
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);
  }
  
  &__section {
    padding: var(--size-20);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg);
    background: var(--background-300);
  }
  
  &__title {
    margin: 0 0 var(--size-16) 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--foreground-900);
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
  }
  
  &__tags .a-pill {
    background: var(--secondary-400);
    color: var(--foreground-900);
  }
}
</style>