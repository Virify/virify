<template>
  <div class="m-accordion-multiselect">
    <label class="m-accordion-multiselect-title | font-bold">
      <input type="checkbox" @change="showSelection" v-model="expandOptions" class="| visually-hidden" />

      {{ title }}

      <AtomsIcon icon="tick-solid" aria-hidden class="m-accordion-multiselect-title-icon" />
    </label>

    <Transition name="m-accordion-multiselect">
      <ul v-show="expandOptions" class="m-accordion-multiselect-list">
        <li v-for="{ key, value } of validatedOptions">
          <AtomsCheckbox :value="key" v-model="selected" :label="value" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  hideWhenUnselected?: boolean,
  options: { key: string, value: string }[] | string[]
}

const props = withDefaults(defineProps<Props>(), {
  hideWhenUnselected: true
})

/**
 *  Model
 */
const selected = defineModel<any>({ default: [] })
const expandOptions = ref<boolean>(false)

/**
 *  Validate options
 */
const validatedOptions = computed(() => {
  return asArrayOfOptions(props.options)
})

/**
 *  Get all keys - as function as this doesn't need to be reactive
 */
function getKeys() {
  return unref(validatedOptions).map(({ key }) => key)
}

/**
 *  Select all
 */
function showSelection({ target }: Event) {
  const isChecked = (target as HTMLInputElement).checked

  if (isChecked) {
    selected.value = getKeys()

    return emits('expanded', true)
  }

  selected.value = []

  emits('expanded', false)
}

watch(selected, (newValue) => {
  const { hideWhenUnselected } = props

  // If no option to hide when empty, do nothing
  if (!hideWhenUnselected) return

  // Otherwise if no options are selected, close
  if (newValue.length === 0) {
    expandOptions.value = false

    emits('expanded', false)
  }
})

/**
 *  Useful events
 */
const emits = defineEmits(['expanded'])
</script>

<style lang="scss">
.m-accordion-multiselect {
  border: 1px solid var(--border-color-200);
  background: var(--background-100);
  color: var(--foreground-100);
  border-radius: var(--border-radius-ui);
  overflow: hidden;
  transition: border-color var(--animation-fast) var(--ease-out);

  &:has(&-title:hover),
  &:has(input:checked) {
    border: 1px solid var(--border-color-300);
  }

  &-title:hover,
  &:has(input:checked) &-title {
    background: var(--background-200);
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
    padding: var(--size-8) var(--size-16);
    cursor: pointer;
    transition: background-color var(--animation-fast) var(--ease-out);
    user-select: none;

    &-icon {
      display: none;
      width: var(--size-28);
      height: var(--size-28);
      transition: scale var(--animation-slow) var(--bounce-out);

      @starting-style {
        scale: 0
      }
    }

    &:has(input:checked) &-icon {
      display: block;
    }
  }

  &-list {
    list-style: none;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: var(--size-16);
    gap: var(--size-8);
    border-top: 1px solid var(--border-color-200);
  }

  &-checkbox {
    display: block;
    white-space: nowrap;
    padding: var(--size-2) var(--size-10);
    border: 1px solid var(--monochrome-400);
    border-radius: var(--border-radius-ui);
  }
}

.m-accordion-multiselect-enter-active,
.m-accordion-multiselect-leave-active {
  interpolate-size: allow-keywords;

  height: calc-size(max-content, size);
  transition-property: height, padding;
  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  overflow: hidden;

  .a-checkbox {
    transition: opacity var(--animation-veryslow) var(--ease-out);

    &-text,
    &-icon {
      transition: none;
    }
  }
}

.m-accordion-multiselect-leave-to,
.m-accordion-multiselect-enter-from {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;

  .a-checkbox {
    opacity: 0;
  }
}
</style>