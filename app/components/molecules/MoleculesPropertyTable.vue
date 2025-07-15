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
 * Property Table Component - Completely rewritten with CSS Grid
 * 
 * A responsive property display component that uses CSS Grid for layout.
 * Handles single/multiple items with responsive behavior.
 */

// ===== INTERFACES =====

interface Field {
  key: string
  label: string
  type?: 'string' | 'boolean' | 'number' | 'array' | 'date'
  formatter?: (value: any) => string
  condition?: (value: any) => boolean
}

interface Props {
  data: any
  fields: Field[]
  title?: string
  showTitle?: boolean
  isArray?: boolean
}

// ===== COMPONENT SETUP =====

const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  isArray: true
})


// ===== COMPUTED PROPERTIES =====

const items = computed(() => {
  if (!props.data) return []

  if (props.isArray) {
    return Array.isArray(props.data) ? props.data : []
  } else {
    return [props.data]
  }
})

const shouldShowTitle = computed(() => {
  return items.value.length > 1
})

// ===== UTILITY FUNCTIONS =====

/**
 * Generate title for each item
 */
function getItemTitle(item: any, index: number): string {
  if (props.title) {
    return props.isArray ? `${props.title} ${index + 1}` : props.title
  }

  if (item.roomNumber) {
    return `Room ${item.roomNumber}`
  }

  if (item.name) {
    return item.name
  }

  return `Item ${index + 1}`
}

/**
 * Get visible fields with formatted values
 */
function getVisibleFields(item: any) {
  return props.fields
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

      if (field.condition) {
        return field.condition(field.value)
      }

      return field.value !== undefined && field.value !== null && field.value !== ''
    })
}

/**
 * Format field value based on type
 */
function getFieldValue(item: any, field: Field) {
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