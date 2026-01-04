<template>
  <div :class="wrapperClass" class="a-input" role="presentation">
    <slot name="prefix" />
    <input v-bind="$attrs" :value="modelValue" :aria-describedby="ariaDescribed" class="| text-input body-sm" @input="handleInput" />
    <slot name="suffix" />
  </div>

  <AtomsInlineError v-if="validityText" :id="finalErrorId">
    {{ validityText }}
  </AtomsInlineError>
</template>

<script setup lang="ts">
/**
 *  Apply the appropriate settings for password inputs
 */
const props = defineProps({
  customValidation: {
    type: Object
  },
  wrapperClass: {
    type: String
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  errorId: {
    type: String,
    default: undefined
  }
})

/**
 *  a11y
 */
const autoId = useId()
const finalErrorId = computed(() => props.errorId || autoId)

const ariaDescribed = computed(() => {
  if (validityText.value) return finalErrorId.value

  return ''
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  checkValidity(event)
}

/**
 *  Validate inputs - this can probably be made into a composable
 */
const { validityText, checkValidity } = useCheckValidity(props.customValidation)

/**
 *  Expose validation state to parent components
 */
defineExpose({
  validityText,
  isValid: computed(() => !validityText.value)
})
</script>
