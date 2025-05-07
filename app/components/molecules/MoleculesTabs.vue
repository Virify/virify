<template>
  <div class="m-tabs">
    <ul role="tablist" class="m-tabs-tabheading">
      <li v-for="{ label }, index of validOptions" role="presentation">
        <button type="button" role="tab" :aria-controls="tabsId" :aria-expanded="index === currentIndex"
          class="m-tabs-tabbutton | body-sm font-semibold" @click.prevent="setCurrentOption(index)">
          {{ label }}
        </button>
      </li>
    </ul>

    <div :id="tabsId" class="m-tabs-content" role="tabpanel">
      <slot v-bind="{ content: currentOption?.content }"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  content: unknown
}

interface Props {
  options: Option[]
}

/**
 *  a11y
 */
const tabsId = useId()

/**
 *  Props
 */
const props = defineProps<Props>()

/**
 *  Ensure tabs are valid
 */
const validOptions = computed<Option[]>(() => {
  const { options } = props

  // Check options is an array of objects
  const isObjectArray = Array.isArray(options) && options.every(isObject)

  // Return valid options
  return isObjectArray ? options : []
})

const currentOption = computed(() => {
  return validOptions.value[currentIndex.value]
})

const optionsCount = computed(() => {
  return validOptions.value.length
})

/**
 *  Select current ref
 */
const currentIndex = ref(0)

function setCurrentOption(index: number) {
  currentIndex.value = index
}
</script>

<style>
.m-tabs-tabheading {
  list-style: none;
  width: fit-content;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-16);
}

.m-tabs-tabbutton {
  padding: var(--size-6);
  margin: 0;
  border: 0;
  border-radius: 0;
  border-bottom: var(--size-4) solid transparent;
}

.m-tabs-tabbutton[aria-expanded=true] {
  color: var(--secondary-400);
  border-bottom-color: var(--secondary-400);
}

.m-tabs-content {
  padding: var(--size-16);
}
</style>