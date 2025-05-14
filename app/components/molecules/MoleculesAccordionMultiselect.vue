<template>
  <div class="m-accordion-multiselect">
    <label class="| title-sm">
      <input type="checkbox" @change="showSelection" v-model="expandOptions" />

      {{ title }}
    </label>

    <Transition>
      <ul v-show="expandOptions" class="m-accordion-multiselect-list">
        <li v-for="{ key, value } of validatedOptions">
          <label>
            <input type="checkbox" :value="key" v-model="selected" />

            {{ value }}
          </label>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  hideWhenUnselected?: boolean,
  options: { key: string, value: string }[]
}

const props = withDefaults(defineProps<Props>(), {
  hideWhenUnselected: true
})

/**
 *  Model
 */
const selected = defineModel<string[]>({ default: [] })
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

<style scoped>
.v-enter-active,
.v-leave-active {
  interpolate-size: allow-keywords;

  height: calc-height(max-content, size);
  transition: height var(--animation-veryslow) var(--ease-out);
  overflow: hidden;
}

.v-leave-to,
.v-enter-from {
  height: 0;
}
</style>