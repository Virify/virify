import type { Component } from 'vue'

interface DialogReturnObject {
  returnValue?: unknown
}

interface GenericObject {
  [key: string]: unknown
}

interface UseDialogState extends Record<string, unknown> {
  component?: Component
  onClose?: (arg0: DialogReturnObject) => void
  className?: string
  wrapperClassName?: string
  props?: GenericObject
}

interface UseDialogResponse {
  dialog?: Ref<UseDialogState | undefined>
  showDialog: (arg0: UseDialogState) => void
  hideDialog: (arg0?: DialogReturnObject) => void
}

/**
 *  Check if object has a key of 'returnValue'
 *
 */
const isObjectWithReturnValue = (obj?: unknown): boolean => {
  return !!(isObject(obj) && 'returnValue' in obj)
}

/**
 *  Structure a dialog response as a valid object
 *
 */
function createResponseObject(response: unknown): DialogReturnObject {
  if (!isObjectWithReturnValue(response)) {
    return { returnValue: response }
  }

  // Else return as object with response as returnValue key
  return response as DialogReturnObject
}

/**
 *  Show and hide a dialog modal
 *
 */
export default function useDialog(): UseDialogResponse {
  const state = useState<UseDialogState | undefined>('dialog')

  /**
   *  Hide a dialog modal
   *
   *  @param {{ returnValue: unknown }} event
   */
  const hideDialog = (evt: unknown) => {
    if (!state.value) return

    // Check the onClose key
    const { onClose } = state.value

    // Then empty the dialog state
    state.value = undefined

    // Verify that onClose is a function
    if (!isFunction(onClose)) return

    // If so, standardise the response...
    const standardisedReturnValue = createResponseObject(evt)

    // ...and run the function
    onClose(standardisedReturnValue)
  }

  /**
   *  Set language based on URL path
   *
   *  @param {String} path
   */
  const showDialog = (config: UseDialogState = {}) => {
    const { component, ...content } = asObject(config)

    if (!component) {
      console.error('No component supplied to Dialog')

      return
    }

    state.value = {
      ...content,
      component: shallowRef(component),
    }
  }

  // Return
  return {
    dialog: state,
    showDialog,
    hideDialog,
  }
}
