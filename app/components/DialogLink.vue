<template>
  <nuxt-link v-bind="$attrs" @click.capture="openDialog">
    <slot></slot>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { DialogState, DialogStateReturn } from '~/types'

interface Props {
  component?: DialogState.component
  componentProps?: DialogState.props
  componentClose?: DialogState.onClose
}

/**
 *  @TODO
 *
 *  @prop {Boolean} always
 *  whether to always open as a dialog, or only if called from within a
 *  dialog component
 *  
 *  always: {
 *    type: Boolean,
 *    default: false
 *  },
 *
 */
const props = defineProps<Props>()

/**
 *  Dialog
 */
const { showDialog } = useDialog()

/**
 *  Check if special keys are pressed
 */
const { isMetaKey } = useEventKey()

/**
 *  Conditionally block navigation and load custom modals
 */
function openDialog(e) {
  const { component, componentProps, componentClose } = props

  // If no component was provided, of meta key pressed, ignore
  if (!component || isMetaKey(e)) return

  // Else block navigation
  e.preventDefault()

  // And then show the appropriate dialog
  showDialog({
    component,
    props: asObject(componentProps),
    onClose: componentClose
  })
}
</script>