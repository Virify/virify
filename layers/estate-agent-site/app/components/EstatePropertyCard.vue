<template>
  <div class="estate-property-card">
    <div class="estate-property-card__image">
      <AtomsCloudFlareImage
        v-if="listing.property.media?.[0]"
        :src="listing.property.media[0].image"
        :alt="listing.property.media[0].alt || 'Property image'"
        variant="card"
        class="estate-property-card__img"
      />
    </div>
    <div class="estate-property-card__content">
      <div class="estate-property-card__price">
        {{ formatPrice(listing.price) }}
      </div>
      <div class="estate-property-card__address">
        {{ listing.property.address.fullAddress }}
      </div>
      <div class="estate-property-card__details">
        <span v-if="listing.property.numberBedrooms">
          {{ listing.property.numberBedrooms }} bed
        </span>
        <span v-if="listing.property.numberBathrooms">
          {{ listing.property.numberBathrooms }} bath
        </span>
        <span v-if="listing.property.numberReceptions">
          {{ listing.property.numberReceptions }} reception
        </span>
      </div>
      <div class="estate-property-card__type">
        {{ listing.property.type.name }} {{ listing.property.classification.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  listing: any
}

const props = defineProps<Props>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped lang="scss">
.estate-property-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  
  &__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f0f0f0;
  }
  
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__content {
    padding: 1.25rem;
  }
  
  &__price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.5rem;
  }
  
  &__address {
    font-size: 0.95rem;
    color: #4a5568;
    margin-bottom: 0.75rem;
  }
  
  &__details {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 0.5rem;
    
    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
  
  &__type {
    font-size: 0.875rem;
    color: #a0aec0;
    text-transform: capitalize;
  }
}
</style>
