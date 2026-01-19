import type { ErrorBoxProp } from '~/types'

type UseFormData = { errors?: ErrorBoxProp, formData?: FormData }

/**
 *  Standardise form validation
 *
 */
export function useFormData(maybeRefForm: unknown): UseFormData {
  const form = unref(maybeRefForm)

  // Create an default errors message
  const errors: ErrorBoxProp = {
    title: 'Element is not a form',
    list: []
  }

  // Check is form
  if (isFormElement(form)) {
    // Change title to generic error
    errors.title = "Your form contains errors"

    // Check all form elements: inputs, selects, and textareas
    form.querySelectorAll('input, select, textarea').forEach((element) => {
      const message = useCheckValidityInput(element)

      // If no error message, skip
      if (!message) return

      // Add error message to array
      errors.list?.push({
        type: (element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).name,
        message
      })
    })
    
    // If no errors found, return formData
    if (errors.list?.length === 0) {
      return {
        formData: new FormData(form)
      }
    }
  }

  // Return list of errors
  return { errors }
}