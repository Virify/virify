import type { ErrorBoxProp } from '~/types'

type UseFormData = { errors: ErrorBoxProp } | { formData: FormData }

/**
 *  Standardise form validation
 *
 */
export function useFormData(maybeRefForm: unknown): UseFormData {
  const form = unref(maybeRefForm)

  // If is a valid form, return formData
  if (isFormElement(form) && form.checkValidity()) {
    return {
      formData: new FormData(form)
    }
  }

  // Create an default errors message
  const errors: ErrorBoxProp = {
    title: 'Element is not a form',
    list: []
  }

  // Check is form
  if (isFormElement(form)) {
    // Change title to generic error
    errors.title = "Your form contains errors"

    // @TODO should also account for other invalid inputs, such as fieldsets
    form.querySelectorAll('input').forEach((input) => {
      const message = useInputValidationMessage(input)

      // If no error message, skip
      if (!message) return

      // Add error message to array
      errors.list.push({
        type: input.name,
        message
      })
    })
  }

  // Return list of errors
  return { errors }
}