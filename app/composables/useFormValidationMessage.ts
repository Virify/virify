interface InputError {
  type: string
  message: string
}

interface Validity {
  validity: boolean
  errors?: InputError[]
}

/**
 *  Standardise form validation
 *
 */
export function useFormValidationMessage(maybeRefForm: unknown): Validity {
  const form = unref(maybeRefForm)

  // Create an erray to hold errors
  const errors: InputError[] = []

  // If not a form, or checkValidity is true, return empty array
  if (!isFormElement(form) || form.checkValidity()) {
    return {
      validity: true
    }
  }

  // Collect all errors in the form
  // @TODO should also account for other invalid inputs, such as fieldsets
  form.querySelectorAll('input').forEach((input) => {
    const message = useInputValidationMessage(input)

    // If no error message, skip
    if (!message) return

    // Add error message to array
    errors.push({
      type: input.name,
      message
    })
  })

  // Return list of errors
  return {
    validity: false,
    errors
  }
}