<template>
  <textarea :value="modelValue" :aria-describedby="ariaDescribed" v-bind="$attrs" @input="handleInput" class="a-textarea" />

  <AtomsInlineError v-if="validityText" :id="finalErrorId">
    {{ validityText }}
  </AtomsInlineError>
</template>

<script setup lang="ts">

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
    border: 1px solid var(--input-text-border);
  }
</style>
