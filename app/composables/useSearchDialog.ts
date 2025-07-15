import type { DialogState, DialogStateReturn } from '~/types'

interface UseDialogResponse {
  dialog?: Ref<DialogState | undefined>
  showDialog: (arg0: DialogState) => void
  hideDialog: (arg0?: DialogState) => void
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
function createResponseObject(response: unknown): DialogStateReturn {
  if (!isObjectWithReturnValue(response)) {
    return { returnValue: response }
  }

  // Else return as object with response as returnValue key
  return response as DialogStateReturn
}

/**
 *  Show and hide a dialog modal
 *
 */
export default function useDialog(): UseDialogResponse {
  const state = useState<DialogState | undefined>('search-dialog')

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
  const showDialog = (config: DialogState = {}) => {
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
