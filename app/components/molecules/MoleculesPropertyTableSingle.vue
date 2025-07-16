<template>
  <div v-if="data" class="m-property-table-single">
    <div class="m-property-table-single__grid">
      <div v-for="[key, value] in visibleFields" :key="key" class="m-property-table-single__field">
        <div class="m-property-table-single__label">{{ formatLabel(key) }}</div>
        <div class="m-property-table-single__value">
          <AtomsIcon v-if="typeof value === 'boolean' && value" icon="tick-solid" class="m-property-table-single__icon m-property-table-single__icon--success" />
          <AtomsIcon v-else-if="typeof value === 'boolean' && !value" icon="cross" class="m-property-table-single__icon m-property-table-single__icon--error" />
          <span v-else>{{ formatValue(key, value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: Record<string, any> | null | undefined
  title?: string
}

const props = defineProps<Props>()

const visibleFields = computed(() => {
  if (!props.data) return []
  
  return Object.entries(props.data).filter(([key, value]) => {
    // Skip internal fields
    if (['id', 'propertyId', 'createdAt', 'updatedAt'].includes(key)) return false
    // Skip null/undefined/empty values
    if (value === null || value === undefined || value === '') return false
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) return false
    return true
  })
})

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
.m-property-table-single {
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid var(--border-color, #e5e7eb);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__field {
    display: flex;
    flex-direction: column;
    padding: var(--size-14) var(--size-20);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    
    @media (min-width: 768px) {
      &:nth-child(odd) {
        border-right: 1px solid var(--border-color, #e5e7eb);
      }
    }
    
    &:last-child,
    &:nth-last-child(2):nth-child(odd) {
      border-bottom: none;
    }
  }
  
  &__label {
    font-weight: 600;
    color: var(--foreground-600);
    margin-bottom: var(--size-4);
  }
  
  &__value {
    color: var(--foreground-900);
    font-weight: 500;
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