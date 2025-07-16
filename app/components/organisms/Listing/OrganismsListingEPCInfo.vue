<template>
  <div class="o-listing-epc-info">
    <div class="o-listing-epc-info__grid">
      <!-- EPC Certificate -->
      <div class="o-listing-epc-info__epc-certificate">
        <h3 class="o-listing-epc-info__title">Energy Performance Certificate</h3>
        <div class="o-listing-epc-info__certificate">
          <div class="o-listing-epc-info__certificate-header">
            <div class="o-listing-epc-info__certificate-title">Energy Efficiency Rating</div>
            <div class="o-listing-epc-info__certificate-subtitle">Current vs Potential</div>
          </div>
          
          <div class="o-listing-epc-info__rating-scales">
            <div class="o-listing-epc-info__rating-scale">
              <div class="o-listing-epc-info__rating-scale-title">Current</div>
              <div class="o-listing-epc-info__rating-bars">
                <div 
                  v-for="rating in epcRatings" 
                  :key="rating.letter" 
                  :class="[
                    'o-listing-epc-info__rating-bar',
                    `o-listing-epc-info__rating-bar--${rating.letter.toLowerCase()}`,
                    { 'o-listing-epc-info__rating-bar--current': rating.letter === currentRating }
                  ]"
                >
                  <span class="o-listing-epc-info__rating-letter">{{ rating.letter }}</span>
                  <span class="o-listing-epc-info__rating-range">{{ rating.range }}</span>
                  <span v-if="rating.letter === currentRating" class="o-listing-epc-info__rating-score">{{ currentScore || '?' }}</span>
                </div>
              </div>
            </div>
            
            <div class="o-listing-epc-info__rating-scale">
              <div class="o-listing-epc-info__rating-scale-title">Potential</div>
              <div class="o-listing-epc-info__rating-bars">
                <div 
                  v-for="rating in epcRatings" 
                  :key="rating.letter" 
                  :class="[
                    'o-listing-epc-info__rating-bar',
                    `o-listing-epc-info__rating-bar--${rating.letter.toLowerCase()}`,
                    { 'o-listing-epc-info__rating-bar--potential': rating.letter === potentialRating }
                  ]"
                >
                  <span class="o-listing-epc-info__rating-letter">{{ rating.letter }}</span>
                  <span class="o-listing-epc-info__rating-range">{{ rating.range }}</span>
                  <span v-if="rating.letter === potentialRating" class="o-listing-epc-info__rating-score">{{ potentialScore || '?' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Other Information -->
      <div class="o-listing-epc-info__other-info">
        <h3 class="o-listing-epc-info__title">Property Information</h3>
        <div class="o-listing-epc-info__info-grid">
          <div v-if="councilTaxBand" class="o-listing-epc-info__info-item">
            <div class="o-listing-epc-info__info-label">Council Tax Band</div>
            <div class="o-listing-epc-info__info-value o-listing-epc-info__info-value--council-tax">
              Band {{ councilTaxBand }}
            </div>
          </div>
          
          <div v-if="serviceCharges" class="o-listing-epc-info__info-item">
            <div class="o-listing-epc-info__info-label">Service Charges</div>
            <div class="o-listing-epc-info__info-value">£{{ serviceCharges }}</div>
          </div>
          
          <div v-if="groundRent" class="o-listing-epc-info__info-item">
            <div class="o-listing-epc-info__info-label">Ground Rent</div>
            <div class="o-listing-epc-info__info-value">£{{ groundRent }}</div>
          </div>
          
          <div v-if="primaryHeating" class="o-listing-epc-info__info-item">
            <div class="o-listing-epc-info__info-label">Primary Heating</div>
            <div class="o-listing-epc-info__info-value">{{ primaryHeating }}</div>
          </div>
          
          <div v-if="hotWaterSource" class="o-listing-epc-info__info-item">
            <div class="o-listing-epc-info__info-label">Hot Water</div>
            <div class="o-listing-epc-info__info-value">{{ hotWaterSource }}</div>
          </div>
          
          <div v-if="broadbandType" class="o-listing-epc-info__info-item">
            <div class="o-listing-epc-info__info-label">Broadband</div>
            <div class="o-listing-epc-info__info-value">{{ broadbandType }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentRating?: string
  currentScore?: number
  potentialRating?: string
  potentialScore?: number
  councilTaxBand?: string
  serviceCharges?: number
  groundRent?: number
  primaryHeating?: string[]
  hotWaterSource?: string
  broadbandType?: string
}

const props = defineProps<Props>()

const epcRatings = [
  { letter: 'A', range: '92-100', color: '#00a651' },
  { letter: 'B', range: '81-91', color: '#19b459' },
  { letter: 'C', range: '69-80', color: '#8cc33c' },
  { letter: 'D', range: '55-68', color: '#ffd100' },
  { letter: 'E', range: '39-54', color: '#f39200' },
  { letter: 'F', range: '21-38', color: '#e2001a' },
  { letter: 'G', range: '1-20', color: '#e2001a' }
]

const primaryHeating = computed(() => {
  if (!props.primaryHeating?.length) return undefined
  return props.primaryHeating.map(type => 
    type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  ).join(', ')
})
</script>

<style lang="scss">
.o-listing-epc-info {
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);
    
    @media (min-width: 768px) {
      grid-template-columns: 2fr 1fr;
    }
  }
  
  &__title {
    margin: 0 0 var(--size-16) 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--foreground-900);
  }
  
  &__epc-certificate {
    background: white;
    border: 2px solid #003d7a;
    border-radius: var(--border-radius-lg);
    padding: var(--size-24);
  }
  
  &__certificate-header {
    text-align: center;
    margin-bottom: var(--size-20);
    padding-bottom: var(--size-16);
    border-bottom: 2px solid #003d7a;
  }
  
  &__certificate-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: #003d7a;
    margin-bottom: var(--size-4);
  }
  
  &__certificate-subtitle {
    font-size: var(--font-size-sm);
    color: #666;
  }
  
  &__rating-scales {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-20);
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__rating-scale-title {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: #003d7a;
    margin-bottom: var(--size-12);
    text-align: center;
  }
  
  &__rating-bars {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
  }
  
  &__rating-bar {
    display: flex;
    align-items: center;
    padding: var(--size-8) var(--size-12);
    position: relative;
    
    &--a { background-color: #00a651; color: white; }
    &--b { background-color: #19b459; color: white; }
    &--c { background-color: #8cc33c; color: white; }
    &--d { background-color: #ffd100; color: #333; }
    &--e { background-color: #f39200; color: white; }
    &--f { background-color: #e2001a; color: white; }
    &--g { background-color: #e2001a; color: white; }
    
    &--current {
      border: 3px solid #003d7a;
      font-weight: 700;
    }
    
    &--potential {
      border: 3px solid #00a651;
      font-weight: 700;
    }
  }
  
  &__rating-letter {
    font-size: var(--font-size-lg);
    font-weight: 700;
    width: 30px;
    text-align: center;
  }
  
  &__rating-range {
    flex: 1;
    margin-left: var(--size-12);
    font-size: var(--font-size-sm);
  }
  
  &__rating-score {
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin-left: var(--size-8);
  }
  
  &__other-info {
    background: var(--background-300);
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg);
    padding: var(--size-20);
  }
  
  &__info-grid {
    display: grid;
    gap: var(--size-16);
  }
  
  &__info-item {
    padding: var(--size-12);
    background: white;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color, #e5e7eb);
  }
  
  &__info-label {
    font-size: var(--font-size-sm);
    color: var(--foreground-600);
    margin-bottom: var(--size-4);
  }
  
  &__info-value {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--foreground-900);
    
    &--council-tax {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: var(--font-size-lg);
      font-weight: 700;
    }
  }
}
</style>