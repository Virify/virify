<template>
  <MoleculesScrollBox class="| focus-overflow">
    <!-- @TODO - add skeleton loader here? -->

    <ul class="o-property-types__list">
      <li v-for="{ name, options } of propertyTypesArray" :key="name" class="o-property-types__list-item | relative">

        <button type="button" class="o-property-types__dropdown | button button-ghost button-xs"
          @click.prevent="showSelectedSubtypes(name, options)">
          0/{{ options.length }} selected
        </button>

        <label class="o-property-types__input | font-bold">
          <input type="checkbox" :name="name" v-model="selectedTypes[name]" class="| visually-hidden"
            @input="event => updateSelectedType(event, name)" />

          <AtomsIcon icon="tick-solid" aria-hidden class="o-property-types__input-icon" />

          <span class="o-property-types__input-text | body-sm">{{ name }}</span>
        </label>
      </li>
    </ul>
  </MoleculesScrollBox>
</template>

<script setup lang="ts">
interface Props {
  propertyTypes?: PropertyTypeWithOptions[]
}

const props = defineProps<Props>()

/**
 *  Ensure property type is a valid format
 */
const propertyTypesArray = computed<PropertyTypeWithOptions[]>(() => {
  return asArray(props.propertyTypes)
})

/**
 *  Allow selecting property type
 */
const selectedTypes = useState('selected-property-types', () => {
  return reactive<Record<string, boolean>>({})
})

function updateSelectedType({ target }: Event, name: string) {
  const { checked } = asObject(target)

  console.log('updateSelectedType', { name, checked })
}

function showSelectedSubtypes(name: string, options: PropertyTypeOption[]) {
  console.log('showSelectedSubtypes', { name, options })
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

  &__list-item:has(input:checked) &__input {
    border-color: var(--secondary-500);
    background-color: var(--secondary-900);
  }

  &__list-item:has(input:checked) &__dropdown {
    background-color: var(--secondary-500);
    color: var(--monochrome-100);
  }

}
</style>