import { defu } from 'defu'
import { useDebounceFn } from '@vueuse/core'

interface ErrorOverrides {
  patternMismatch?: string
}

const defaultOverrides = {
  patternMismatch: 'Value is an invalid format.',
  valueMissing: 'This field is required.'
}

/**
 *  Standardise input validation
 *
 */
export function useCheckValidityInput(maybeRefInput: unknown, userOverrides: ErrorOverrides = {}): string {
  const input = unref(maybeRefInput)

  // Combine user and default overrides
  const overrides = defu(userOverrides, defaultOverrides)

  // If not an input element, or checkValidity is true, return empty string
  if (!isInputElement(input) && !isSelectElement(input) && !isTextAreaElement(input)) return ''
  if (input.checkValidity()) return ''

  // Destructure overrides
  const { patternMismatch, valueMissing } = asObject(overrides)

  // Pattern overrides
  if (input.validity.patternMismatch && isString(patternMismatch)) {
    input.setCustomValidity(patternMismatch)
  }
  else if (input.validity.valueMissing && isString(valueMissing)) {
    input.setCustomValidity(valueMissing)
  }
  else {
    input.setCustomValidity('')
  }

  return input.validationMessage
}

/**
 *  Composable for input validation
 *
 */
export function useCheckValidity(overrides = {}) {
  const validityText = ref()

  const checkValidity = useDebounceFn(({ target }) => {
    validityText.value = useCheckValidityInput(target, overrides)
  }, 500)

  return { validityText, checkValidity }
}