/**
 *  Standardise input validation
 *
 */
export function useInputValidationMessage(maybeRefInput: unknown): string {
  const input = unref(maybeRefInput)

  // If not an input, or checkValidity is true, return empty string
  if (!isInputElement(input) || input.checkValidity()) return ''

  // If validation failed due to a pattern mismatch, allow overrides
  if (input.validity.patternMismatch) {
    return `Your password should contain at least 1 number and at least one of the following symbols: ${PASSWORD_VALID_SYMBOLS}`
  }
  // Otherwise just show the user the error
  else {
    return input.validationMessage
  }
}