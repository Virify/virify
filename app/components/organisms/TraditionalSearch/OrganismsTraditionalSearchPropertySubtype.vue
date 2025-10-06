<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <button type="button" :class="buttonClass" class="| button button-ghost button-xs"
        aria-label="Show property types">
        {{ selected.length }}/{{ options.length }} selected
      </button>
    </PopoverTrigger>

    <PopoverContent :side-offset="10" position-strategy="absolute"
      class="o-traditional-search-property-subtype__content">
      <PopoverClose class="o-traditional-search-property-subtype__close | button button-ghost"
        aria-label="Close popover">
        <AtomsIcon icon="cross" aria-hidden class="o-traditional-search-property-subtype__close-icon" />
      </PopoverClose>
      <h3 class="o-traditional-search-property-subtype__title | title-xs">{{ name }}</h3>

      <ul class="o-traditional-search-property-subtype__list">
        <li v-for="{ value, checked } of optionsWithSelection" :key="value">
          <AtomsCheckbox :label="value" :checked @input="emitChange(value, !checked)" />
        </li>
      </ul>
    </PopoverContent>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverClose } from 'reka-ui'

interface Props {
  buttonClass?: string
  name: string
  options: PropertyTypeOption[]
  selected: string[]
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false
})

/**
 *  Get visual options
 */
const optionsWithSelection = computed(() => {
  const { options, selected } = props

  return asArray(options).map(option => {
    const { value } = asObject(option)

    return {
      ...option,
      checked: selected.includes(value)
    }
  })
})

/**
 *  Emit changes
 */
const emits = defineEmits(['update-selected'])

async function emitChange(updatedValue: string, checked: boolean) {
  const { name, selected } = asObject(props)

  if (checked) {
    emits('update-selected', {
      name,
      selected: [...selected, updatedValue]
    })

    return
  }

  emits('update-selected', {
    name,
    selected: selected.filter(str => str != updatedValue)
  })
}

</script>

<style lang="scss">
.o-traditional-search-property-subtype {

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: var(--size-6);
    right: var(--size-6);
    width: var(--size-32);
    height: var(--size-32);
    padding: 0;
  }

  &__close-icon {
    display: block;
    width: var(--size-20);
    height: var(--size-20);
  }

  &__content {
    z-index: 9;
    min-width: 15ch;
    max-width: 20ch;
    background: var(--background-200);
    color: var(--foreground-100);
    padding: var(--size-16);
    border-radius: var(--border-radius-ui);
    border: 1px solid var(--border-color-200);
    box-shadow: var(--elevate-200);
  }

  &__title {
    margin-right: var(--size-40);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-4);

    .a-checkbox,
    .a-checkbox:has(input:checked) {
      border: 0;
      background: none;
    }
  }
}
</style>