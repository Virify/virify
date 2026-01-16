<template>
  <div class="o-property-types" role="presentation">
    <ul class="o-property-types__list">
      <li v-for="{ name, icon, options, selected, defaultSelected } of propertyTypes" :key="name"
        class="o-property-types__list-item | gradient-box">

        <OrganismsTraditionalSearchPropertySubtype button-class="o-property-types__dropdown" :name :options :selected
          @update-selected="updateSelectedSubtype" />

        <label class="o-property-types__input | font-bold">
          <input type="checkbox" :name="name" v-model="selectedTypes[name]" class="| visually-hidden"
            :checked="defaultSelected" @input="event => updateSelectedType(event, { name, options })" />

          <AtomsIcon :icon aria-hidden class="o-property-types__input-icon" />

          <span class="o-property-types__input-text | body-sm">{{ name }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface PropertyType extends PropertyTypeWithOptions {
  selected: string[]
  icon: string
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
    propertyTypes.value = asArray(data.value).map((row) => {
      const { options, name, defaultSelected } = asObject(row)

      return {
        ...(asObject(row) as Record<string, unknown>),
        icon: propertyTypeIcons[name as string] || 'legacy-search/unknown',
        selected: defaultSelected ? getOptionsAsStrings(options) : []
      }
    }) as never as PropertyType[]
  })
})

/**
 *  Allow selecting property type
 */
const selectedTypes = useState('selected-property-types', () => {
  return reactive<Record<string, boolean>>({})
})

/**
 *  Update selected types
 */
type MatchType = PropertyType | undefined

type SelectType = {
  name: string
  options: PropertyTypeOption[]
}

type SelectSubType = {
  name: string
  selected: string[]
}

function getOptionsAsStrings(options: PropertyTypeOption[]): string[] {
  return asArray(options).map(({ value }) => value)
}

function setSelectedOptions(match: MatchType, options: string[]) {
  if (!match) return

  match.selected = options
}

function getPropertyTypeByName(name: string): PropertyType | undefined {
  return propertyTypes.value.find((row) => row.name === name)
}

function updateSelectedType({ target }: Event, selected: SelectType) {
  const { checked } = asObject(target)
  const { name, options } = asObject(selected)

  // Find the matching option
  const match = getPropertyTypeByName(name)

  // If unchecked, select all
  if (checked) {
    setSelectedOptions(match, getOptionsAsStrings(options))

    return
  }

  // Else select none
  setSelectedOptions(match, [])
}

function updateSelectedSubtype({ name, selected }: SelectSubType) {
  const match = getPropertyTypeByName(name)

  // If no matches, do nothing
  if (!match) return

  // If a selection is made, apply it
  setSelectedOptions(match, selected)

  // Ensure match is appropriately updated
  selectedTypes.value[name] = !!selected.length
}

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