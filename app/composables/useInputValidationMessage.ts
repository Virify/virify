interface ErrorOverrides {
  patternMismatch?: string
}

/**
 *  Standardise input validation
 *
 */
export function useInputValidationMessage(maybeRefInput: unknown, overrides: ErrorOverrides = {}): string {
  const input = unref(maybeRefInput)

  // If not an input, or checkValidity is true, return empty string
  if (!isInputElement(input) || input.checkValidity()) return ''

  // If validation failed due to a pattern mismatch, allow overrides
  if (input.validity.patternMismatch) {
    const { patternMismatch } = asObject(overrides)

    return asString(patternMismatch) || 'Not a valid format'
  }
  // Otherwise just show the user the error
  else {
    return input.validationMessage
  }
}