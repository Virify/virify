<template>
  <MoleculesScrollBox class="| focus-overflow">
    <!-- @TODO - add skeleton loader here? -->

    <ul class="o-property-types__list">
      <li v-for="{ name, options, selected, defaultSelected } of propertyTypes" :key="name"
        class="o-property-types__list-item | relative">

        <OrganismsTraditionalSearchPropertySubtype button-class="o-property-types__dropdown" :name :options :selected
          @update-selected="updateSelectedSubtype" />

        <label class="o-property-types__input | font-bold">
          <input type="checkbox" :name="name" v-model="selectedTypes[name]" class="| visually-hidden"
            :checked="defaultSelected" @input="event => updateSelectedType(event, { name, options })" />

          <AtomsIcon icon="tick-solid" aria-hidden class="o-property-types__input-icon" />

          <span class="o-property-types__input-text | body-sm">{{ name }}</span>
        </label>
      </li>
    </ul>
  </MoleculesScrollBox>
</template>

<script setup lang="ts">
interface PropertyType extends PropertyTypeWithOptions {
  selected: string[]
}

/**
 *  Fetch property types (only once!) and save to state
 */
const propertyTypes = useState<PropertyType[]>('property-types', () => [])

callOnce(async () => {
  useFetch<PropertyTypeWithOptions[]>('/api/property-type/').then(({ data }) => {
    propertyTypes.value = asArray(data.value).map((row) => {
      const { options, defaultSelected } = asObject(row)

      return {
        ...(asObject(row) as Record<string, unknown>),
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
.o-property-types {

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: var(--size-8);
  }

  &__list-item {
    display: flex;
    align-items: stretch;
  }

  &__input {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 11ch;
    background: transparent;
    gap: var(--size-6);
    border: 2px solid var(--border-color-100);
    border-radius: var(--border-radius-xl);
    padding: var(--size-10) var(--size-8) var(--size-48);
    transition: border-color, background-color;
    transition-duration: var(--animation-fast);
    cursor: pointer;
  }

  &__input-icon {
    display: block;
    width: var(--size-48);
    height: var(--size-48);
  }

  &__input-text {
    max-width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: var(--lineheight-sm);
  }

  &__dropdown {
    position: absolute;
    bottom: var(--size-8);
    left: var(--size-8);
    right: var(--size-8);
    height: var(--size-36);
    padding: 0;
    margin: 0;
    width: auto;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-lg);
    font-weight: normal;
  }

  /**
   *  Hover, active state
   */
  &__input:hover {
    border-color: var(--secondary-400);
  }

  &__list-item:has(&__dropdown:hover):not(:has(input:checked)) &__input {
    border-color: var(--border-color-300);
  }

  &__list-item:has(input:checked) &__input {
    border-color: var(--secondary-500);
    background-color: var(--secondary-900);
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