<template>
  <div v-if="data && data.length > 0" class="m-property-table-array">
    <div class="m-property-table-array__grid">
      <div v-for="(item, index) in data" :key="item.id || index" class="m-property-table-array__card">
        <div v-if="data.length > 1" class="m-property-table-array__title">
          {{ title }} {{ index + 1 }}
        </div>
        
        <div v-if="item.description" class="m-property-table-array__description">
          {{ item.description }}
        </div>
        
        <div class="m-property-table-array__fields">
          <div v-for="[key, value] in getVisibleFields(item)" :key="key" class="m-property-table-array__field">
            <div class="m-property-table-array__label">{{ formatLabel(key) }}</div>
            <div class="m-property-table-array__value">
              <AtomsIcon v-if="typeof value === 'boolean' && value" icon="tick-solid" class="m-property-table-array__icon m-property-table-array__icon--success" />
              <AtomsIcon v-else-if="typeof value === 'boolean' && !value" icon="cross" class="m-property-table-array__icon m-property-table-array__icon--error" />
              <span v-else>{{ formatValue(key, value) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Record<string, any>[] | null | undefined
  title?: string
}

const props = defineProps<Props>()

function getVisibleFields(item: Record<string, any>) {
  return Object.entries(item).filter(([key, value]) => {
    // Skip internal fields
    if (['id', 'propertyId', 'createdAt', 'updatedAt'].includes(key)) return false
    // Skip description (shown separately)
    if (key === 'description') return false
    // Skip roomNumber if there's only one item
    if (key === 'roomNumber' && props.data?.length === 1) return false
    // Skip null/undefined/empty values
    if (value === null || value === undefined || value === '') return false
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) return false
    return true
  })
}

function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
}

function formatValue(key: string, value: any): string {
  // Size formatting
  if (key === 'size' || key.includes('Size')) {
    return typeof value === 'number' && !isNaN(value) ? `${Math.round(value)} m²` : String(value)
  }
  
  // Date formatting
  if (key.includes('Date') || value instanceof Date) {
    const date = value instanceof Date ? value : new Date(value)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  
  // Money formatting
  if (key.includes('Charges') || key.includes('Rent') || key.includes('Cost')) {
    return typeof value === 'number' && !isNaN(value) ? `£${value}` : String(value)
  }
  
  // Speed formatting
  if (key.includes('Speed') || key.includes('Mbps')) {
    return typeof value === 'number' && !isNaN(value) ? `${value} Mbps` : String(value)
  }
  
  // Array formatting
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') {
        return item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      }
      return item
    }).join(', ')
  }
  
  // Enum formatting for strings
  if (typeof value === 'string' && /^[A-Z_]+$/.test(value)) {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }
  
  return String(value)
}
</script>

<style lang="scss">
.m-property-table-array {
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-20);
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  &__card {
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    background: var(--background-300);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  &__title {
    padding: var(--size-16) var(--size-20);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    font-weight: 600;
    color: var(--foreground-800);
  }
  
  &__description {
    padding: var(--size-16) var(--size-20);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    color: var(--foreground-700);
  }
  
  &__fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  &__field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--size-14) var(--size-20);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  &__label {
    font-weight: 600;
    color: var(--foreground-600);
    margin-right: var(--size-12);
  }
  
  &__value {
    color: var(--foreground-900);
    font-weight: 500;
    text-align: right;
  }
  
  &__icon {
    display: inline-block;
    
    &--success {
      width: var(--size-20);
      height: var(--size-20);
      color: var(--success-500, #10b981);
    }
    
    &--error {
      width: var(--size-20);
      height: var(--size-20);
      color: var(--background-200);
      background-color: var(--danger-500, #ef4444);
      border-radius: 50%;
      padding: var(--size-3);
      box-sizing: border-box;
      transform: scale(0.8);
    }
  }
}
</style>