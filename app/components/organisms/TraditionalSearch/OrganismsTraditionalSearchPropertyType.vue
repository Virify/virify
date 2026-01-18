<template>
  <div class="o-property-types" role="presentation">
    <ul class="o-property-types__list">
      <li v-for="{ name, icon, options } of propertyTypes" :key="name"
        class="o-property-types__list-item | gradient-box">

        <OrganismsTraditionalSearchPropertySubtype button-class="o-property-types__dropdown" :name :options
          :selected="modelSelected[name]" @update-selected="updateSubTypes" />

        <label class="o-property-types__input | font-bold">
          <input type="checkbox" :name="name" class="| visually-hidden" :checked="modelSelected[name]?.length"
            @input.prevent="updateTypes({ name, options })" />

          <AtomsIcon :icon aria-hidden class="o-property-types__input-icon" />

          <span class="o-property-types__input-text | body-sm">{{ name }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface SelectType {
  name: string
  options: PropertyTypeOption[]
}

interface SelectSubType {
  name: string
  selected: string[]
}

interface PropertyType extends PropertyTypeWithOptions {
  selected: string[]
  icon: string
}

/**
 *  Model
 */
const modelSelected = defineModel<{ [key: string]: string[] }>({
  default: reactive({})
})

/**
 *  Manage model
 */
function updateTypes({ name, options }: SelectType) {
  const isSelected = modelSelected.value[name]?.length

  modelSelected.value[name] = isSelected ? [] : getOptionsAsStrings(options)
}

function updateSubTypes({ name, selected }: SelectSubType) {
  modelSelected.value[name] = selected
}

function getOptionsAsStrings(options: PropertyTypeOption[]): string[] {
  return asArray(options).map(({ value }) => value)
}

/**
 *  Fetch property types (only once!) and save to state
 */
const propertyTypes = useState<PropertyType[]>('property-types', () => [])

const propertyTypeIcons: Record<string, string> = {
  'House': 'legacy-search/house',
  'Bungalow': 'legacy-search/bungalow',
  'Cottage': 'legacy-search/cottage',
  'Flat': 'legacy-search/flats',
  'Land': 'legacy-search/land',
  'Farms': 'legacy-search/farms',
  'Specialty': 'legacy-search/specialty',
  'Student Accommodation': 'legacy-search/student-accommodation',
}

callOnce(async () => {
  useFetch<PropertyTypeWithOptions[]>('/api/property-type/').then(({ data }) => {
    const types: PropertyType[] = asArray(data.value)

    for (const type of types) {
      const { name, defaultSelected, options } = asObject(type)

      // Store property options, icon, etc.
      propertyTypes.value.push({
        ...type,
        icon: propertyTypeIcons[name] || 'legacy-search/unknown',
      })

      // Store whether property type is selected
      modelSelected.value[name] = defaultSelected ? getOptionsAsStrings(options) : []
    }
  })
})

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.o-property-types {
  container-type: inline-size;

  --o-property-types-padding: var(--size-10);

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--size-12);
    grid-template-columns: repeat(2, 1fr);

    @container (width > 480px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @container (width > 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__list-item {
    position: relative;
    display: flex;
    align-items: stretch;
    min-height: 12ch;
  }

  &__input {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: transparent;
    gap: var(--size-8);
    border: 2px solid transparent;
    border-radius: var(--border-radius-2xl);
    padding: var(--size-8) var(--o-property-types-padding) var(--size-56);
    transition: border-color, background-color;
    transition-duration: var(--animation-fast);
    cursor: pointer;
  }

  &__input-icon {
    display: block;
    width: var(--size-40);
    height: var(--size-40);
  }

  &__input-text {
    max-width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: var(--lineheight-xs);
  }

  &__dropdown {
    position: absolute;
    bottom: var(--o-property-types-padding);
    left: var(--o-property-types-padding);
    right: var(--o-property-types-padding);
    height: var(--size-40);
    font-weight: var(--font-semibold);
    padding: 0;
    margin: 0;
    width: auto;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-xl);
    background: fn.faded-color(12%, light-dark(var(--blue-700), var(--blue-900)));
    color: currentColor;

    &[aria-expanded=true],
    &:hover {
      background: fn.faded-color(30%, light-dark(var(--blue-700), var(--blue-900)));
      color: currentColor;
    }
  }

  /**
   *  Hover, active state
   */
  &__input:hover {
    border-color: var(--secondary-400);
  }

  &__list-item:has(button[aria-expanded=true]) &__input,
  &__list-item:has(&__dropdown:hover):not(:has(input:checked)) &__input {
    border-color: light-dark(var(--secondary-700), var(--secondary-200));
  }

  &__list-item:has(input:checked) &__input {
    border-color: var(--secondary-500);
    background-color: light-dark(var(--secondary-900), var(--background-200));
  }

  &__list-item:has(input:checked) &__dropdown {
    background-color: var(--secondary-500);
    color: var(--monochrome-100);

    &:hover {
      background-color: var(--secondary-600);
      color: var(--monochrome-100);
    }
  }
}
</style>