<template>
  <div class="m-property-table">
    <div v-for="(item, index) in items" :key="item.id || index" 
         :class="['m-property-table__card', { 'm-property-table__card--single': isSingleItem }]">
      <h4 v-if="showTitle && shouldShowTitle" class="m-property-table__title | title-xs">
        {{ getItemTitle(item, index) }}
      </h4>
      
      <div v-if="item.description" class="m-property-table__description | body-md">
        {{ item.description }}
      </div>
      
      <table class="m-property-table__table | body-sm">
        <tbody>
          <tr v-for="field in getVisibleFields(item)" :key="field.key">
            <td class="m-property-table__label">{{ field.label }}</td>
            <td class="m-property-table__value">
              <AtomsIcon v-if="field.type === 'boolean' && field.value" icon="tick-solid" class="m-property-table__tick" />
              <AtomsIcon v-else-if="field.type === 'boolean' && !field.value" icon="cross" class="m-property-table__cross" />
              <span v-else>{{ field.value }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  isArray: true
})

const items = computed(() => {
  if (!props.data) return []
  
  if (props.isArray) {
    return Array.isArray(props.data) ? props.data : []
  } else {
    return [props.data]
  }
})

const shouldShowTitle = computed(() => {
  // Only show title if there are multiple items
  return items.value.length > 1
})

const isSingleItem = computed(() => {
  return items.value.length === 1
})

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
      
      // Hide description field from table rows (it's already shown at the top)
      if (field.key === 'description') {
        return false
      }
      
      if (field.condition) {
        return field.condition(field.value)
      }
      return field.value !== undefined && field.value !== null && field.value !== ''
    })
}

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
    return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  
  // Handle arrays that aren't explicitly marked as type 'array'
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  
  return value
}
</script>

<style lang="scss">
.m-property-table {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--size-20);

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

    &--single {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;

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

    .m-property-table__card--single & {
      padding: var(--size-16) 0;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
  }

  &__label {
    padding: var(--size-14) var(--size-20);
    font-weight: 600;
    color: var(--foreground-600);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    width: 40%;
    vertical-align: middle;

    letter-spacing: 0.025em;
    white-space: nowrap;

    .m-property-table__card--single & {
      padding: var(--size-14) 0;
    }
  }

  &__value {
    padding: var(--size-14) var(--size-20);
    color: var(--foreground-900);
    border-bottom: 1px solid var(--border-color, #e5e7eb);
    vertical-align: middle;
    word-break: break-word;
    font-weight: 500;

    .m-property-table__card--single & {
      padding: var(--size-14) 0;
    }
  }

  &__tick {
    width: var(--size-20);
    height: var(--size-20);
    color: var(--success-500, #10b981);
  }

  &__cross {
    width: var(--size-16);
    height: var(--size-16);
    color: var(--background-200);
    background-color: var(--danger-500, #ef4444);
    border-radius: 50%;
    padding: var(--size-2);
  }

  &__no {
    color: var(--foreground-400);
    font-size: var(--text-lg);
  }

  tr:last-child {
    .m-property-table__label,
    .m-property-table__value {
      border-bottom: none;
    }
  }
}
</style>