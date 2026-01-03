<template>
  <textarea :value="modelValue" :aria-describedby="ariaDescribed" v-bind="$attrs" @input="handleInput" class="a-textarea" />

  <AtomsInlineError v-if="validityText" :id="errorId">
    {{ validityText }}
  </AtomsInlineError>
</template>

<script setup lang="ts">

/**
 *  a11y
 */
const errorId = useId()

const ariaDescribed = computed(() => {
  if (validityText.value) return errorId

  return ''
})

/**
 *  Props and emits
 */
const props = defineProps({
  customValidation: {
    type: Object
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  checkValidity(event)
}

/**
 *  Validate textarea
 */
const { validityText, checkValidity } = useCheckValidity(props.customValidation)
</script>
<style>
  .a-textarea {
    font-size: var(--font-md);
  }
</style>
