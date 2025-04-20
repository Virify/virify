/**
 *  Standardise input validation
 *
 */
export function useInputValidationMessage(maybeRefInput: unknown): string {
  const input = unref(maybeRefInput)

  // If input is not an element it can't be invalid, so return empty string
  if (!isInputElement(input)) return ''

  // If valid, return empty string
  if (input.checkValidity()) return ''

  // If validation failed due to a pattern mismatch, allow overrides
  if (input.validity.patternMismatch) {
    return `Your password should contain at least 1 number and at least one of the following symbols: ${PASSWORD_VALID_SYMBOLS}`
  }
  // Otherwise just show the user the error
  else {
    return input.validationMessage
  }
}