<template>
  <!-- 
    Property Table Component - Grid-based responsive layout
    
    Features:
    - Mobile: Single column, label above value
    - Desktop: Two columns for single items, single column for arrays
    - Clickable text truncation with ellipsis
    - Boolean values as centered icons
  -->
  <div class="m-property-table">
    <!-- Array Items Grid -->
    <div v-if="isArray" class="m-property-table__items-grid">
      <div v-for="(item, index) in items" :key="item.id || index" class="m-property-table__card">

        <!-- Item Description -->
        <div v-if="item.description" class="m-property-table__description | body-sm">
          {{ item.description }}
        </div>

        <!-- Fields Grid -->
        <div class="m-property-table__grid">
          <div v-for="field in getVisibleFields(item)" :key="field.key" class="m-property-table__field | body-sm">

            <div class="m-property-table__label | body-sm">{{ field.label }}</div>

            <div class="m-property-table__value | body-sm">
              <!-- Boolean Icons -->
              <AtomsIcon v-if="field.type === 'boolean' && field.value" icon="tick-solid"
                class="m-property-table__icon m-property-table__icon--success" />
              <AtomsIcon v-else-if="field.type === 'boolean' && !field.value" icon="cross"
                class="m-property-table__icon m-property-table__icon--error" />

              <!-- Text Values -->
              <span v-else class="m-property-table__text | body-sm">
                {{ field.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Single Item -->
    <div v-else v-for="(item, index) in items" :key="item.id || index" class="m-property-table__card">

      <!-- Item Description -->
      <div v-if="item.description" class="m-property-table__description | body-sm">
        {{ item.description }}
      </div>

      <!-- Fields Grid -->
      <div class="m-property-table__grid m-property-table__grid--two-column">
        <div v-for="field in getVisibleFields(item)" :key="field.key" class="m-property-table__field | body-sm">

          <div class="m-property-table__label | body-sm">{{ field.label }}</div>

          <div class="m-property-table__value | body-sm">
            <!-- Boolean Icons -->
            <AtomsIcon v-if="field.type === 'boolean' && field.value" icon="tick-solid"
              class="m-property-table__icon m-property-table__icon--success" />
            <AtomsIcon v-else-if="field.type === 'boolean' && !field.value" icon="cross"
              class="m-property-table__icon m-property-table__icon--error" />

            <!-- Text Values -->
            <span v-else class="m-property-table__text | body-sm">
              {{ field.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Property Table Component - Typed version using Prisma types
 * 
 * A responsive property display component that uses CSS Grid for layout.
 * Accepts typed property feature data directly from Prisma models.
 */

import type { 
  Bedroom, 
  Bathroom, 
  Kitchen, 
  LivingArea, 
  Reception, 
  Diningroom, 
  OutdoorSpace, 
  Parking, 
  Utility, 
  AdditionalToilet, 
  Security, 
  Storage, 
  EnergyAndUtilities, 
  Accessibility, 
  AdditionalFeatures, 
  RunningCosts 
} from '@prisma/client'

// ===== UNION TYPE FOR ALL SUPPORTED PROPERTY FEATURES =====

type PropertyFeatureData = 
  | Bedroom[] 
  | Bathroom[] 
  | Kitchen 
  | LivingArea 
  | Reception[] 
  | Diningroom 
  | OutdoorSpace 
  | Parking 
  | Utility 
  | AdditionalToilet 
  | Security 
  | Storage 
  | EnergyAndUtilities 
  | Accessibility 
  | AdditionalFeatures 
  | RunningCosts

// ===== COMPONENT PROPS =====

interface Props {
  data: PropertyFeatureData | null | undefined
  title?: string
  showTitle?: boolean
}

// ===== COMPONENT SETUP =====

const props = withDefaults(defineProps<Props>(), {
  showTitle: true
})

// ===== COMPUTED PROPERTIES =====

const items = computed(() => {
  if (!props.data) return []
  return Array.isArray(props.data) ? props.data : [props.data]
})

const isArray = computed(() => Array.isArray(props.data))

const shouldShowTitle = computed(() => {
  return items.value.length > 1
})

// ===== FIELD DEFINITIONS =====

const fields = computed(() => {
  if (!props.data || items.value.length === 0) return []
  
  const sampleItem = items.value[0]
  if (!sampleItem) return []
  
  const generatedFields = []
  
  // Generate fields based on the actual data structure
  for (const [key, value] of Object.entries(sampleItem as Record<string, any>)) {
    // Skip internal fields
    if (['id', 'propertyId', 'createdAt', 'updatedAt'].includes(key)) continue
    
    // Skip null/undefined values
    if (value === null || value === undefined) continue
    
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) continue
    
    // Skip empty strings
    if (typeof value === 'string' && value === '') continue
    
    // Create field definition
    const field = {
      key,
      label: formatLabel(key),
      type: getFieldType(value),
      formatter: getFieldFormatter(key, value)
    }
    
    generatedFields.push(field)
  }
  
  return generatedFields.sort((a, b) => {
    // Priority order: roomNumber, size, then alphabetical
    const priorityOrder = ['roomNumber', 'size', 'description']
    const aIndex = priorityOrder.indexOf(a.key)
    const bIndex = priorityOrder.indexOf(b.key)
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    
    // Description always last
    if (a.key === 'description') return 1
    if (b.key === 'description') return -1
    
    return a.label.localeCompare(b.label)
  })
})

// ===== UTILITY FUNCTIONS =====

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

function getFieldType(value: any): string {
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (value instanceof Date) return 'date'
  if (typeof value === 'string' && value.includes('T') && value.includes('Z')) return 'date'
  return 'string'
}

function getFieldFormatter(key: string, value: any): ((value: any) => string) | undefined {
  // Size formatting
  if (key === 'size' || key.includes('Size')) {
    return (val: number) => typeof val === 'number' && !isNaN(val) ? `${Math.round(val)} m²` : ''
  }
  
  // Date formatting
  if (key.includes('Date') || value instanceof Date) {
    return (val: Date | string) => {
      const date = val instanceof Date ? val : new Date(val)
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  }
  
  // Money formatting
  if (key.includes('Charges') || key.includes('Rent') || key.includes('Cost')) {
    return (val: number) => typeof val === 'number' && !isNaN(val) ? `£${val}` : ''
  }
  
  // Speed formatting
  if (key.includes('Speed') || key.includes('Mbps')) {
    return (val: number) => typeof val === 'number' && !isNaN(val) ? `${val} Mbps` : ''
  }
  
  // Array formatting
  if (Array.isArray(value)) {
    return (val: any[]) => {
      if (!Array.isArray(val)) return ''
      return val.map(item => {
        if (typeof item === 'string') {
          // Format enum values
          return item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        }
        return item
      }).join(', ')
    }
  }
  
  // Enum formatting for strings
  if (typeof value === 'string' && /^[A-Z_]+$/.test(value)) {
    return (val: string) => val.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }
  
  return undefined
}

/**
 * Get visible fields with formatted values
 */
function getVisibleFields(item: any) {
  return fields.value
    .map(field => ({
      ...field,
      value: getFieldValue(item, field)
    }))
    .filter(field => {
      // Hide room number if there's only one item
      if (field.key === 'roomNumber' && items.value.length === 1) {
        return false
      }

      // Hide description field (shown separately)
      if (field.key === 'description') {
        return false
      }

      return field.value !== undefined && field.value !== null && field.value !== ''
    })
}

/**
 * Format field value based on type
 */
function getFieldValue(item: any, field: any) {
  const value = item[field.key]

  if (field.formatter) {
    return field.formatter(value)
  }

  if (field.type === 'array' && Array.isArray(value)) {
    return value.join(', ')
  }

  if (field.type === 'number' && typeof value === 'number') {
    return value.toString()
  }

  if (field.type === 'date' && value) {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return value
}

</script>

<style lang="scss">
.m-property-table {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-20);
  
  &__items-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-20);
    
    // Desktop: Two columns for array items
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
    transition: box-shadow var(--animation-medium) ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    // Single item styling
    &:has(.m-property-table__grid--two-column) {
      background: transparent;
      border: none;
      box-shadow: none;

      &:hover {
        box-shadow: none;
      }
    }
  }

  &__title {
    margin: 0;
    padding: var(--size-16) var(--size-20);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    color: var(--foreground-800);
  }

  &__description {
    padding: var(--size-16) var(--size-20);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    color: var(--foreground-700);
    
    // Two-column layout adjustments
    .m-property-table__grid--two-column & {
      @media (min-width: 768px) {
        padding: var(--size-16) 0;
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;

    // Mobile: Stack all fields
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }

    // Desktop: Two columns for single items only
    &--two-column {
      @media (min-width: 768px) {
        grid-template-columns: 40% 40%;
        gap: var(--size-0);
        justify-content: space-between;
        padding: 0 var(--size-20);
      }
    }
  }

  &__field {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    padding: var(--size-14) var(--size-20);
    align-items: center;
    gap: var(--size-12);

    // All fields: space-between layout
    justify-content: space-between;
    
    // Desktop: Allow same wrapping behavior as mobile
    // (no nowrap override needed)

    // Two-column layout adjustments
    .m-property-table__grid--two-column & {
      @media (min-width: 768px) {
        padding: var(--size-14) 0;
      }
    }

    // Boolean fields: Always side by side
    &:has(.m-property-table__icon) {
      flex-wrap: nowrap;
    }

    &:last-child {
      border-bottom: none;
    }

  }

  &__label {
    font-weight: 600;
    color: var(--foreground-600);
    letter-spacing: 0.025em;
    white-space: nowrap;
    flex: 0 0 auto;
    margin-right: var(--size-12);

    @media (min-width: 768px) {
      flex: 0 0 40%;

      .m-property-table__grid--two-column & {
        margin-right: 0;
        flex: 0 0 auto;
      }
    }

    // Boolean fields: don't take fixed width, let space-between work
    .m-property-table__field:has(.m-property-table__icon) & {
      @media (min-width: 768px) {
        flex: 0 0 auto;
        margin-right: var(--size-12);
      }
    }
  }

  &__value {
    color: var(--foreground-900);
    font-weight: 500;
    flex: 0 0 auto; // All fields use flex: 0 0 auto for space-between

    @media (min-width: 768px) {
      text-align: right;

      .m-property-table__grid--two-column & {
        text-align: right;
      }
    }

    // Boolean fields: center align icons
    .m-property-table__field:has(.m-property-table__icon) & {
      text-align: center !important; // Force center for icons
    }

    // When text wraps (takes full width), align left on mobile, right on desktop (but not for boolean fields)
    &:only-child:not(:has(.m-property-table__icon)) {
      text-align: left;
      flex: 1 1 100%;
      
      @media (min-width: 768px) {
        text-align: right;
      }
    }
  }

  &__icon {
    display: block;
    margin: 0 auto;

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

  &__text {
    display: block;
    word-break: break-word;
  }
}
</style>