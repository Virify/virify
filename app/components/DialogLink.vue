<template>
  <nuxt-link v-bind="{ ...aria, ...$attrs }" @click.capture="openDialog" class="link">
    <slot></slot>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { DialogState, DialogStateReturn } from '~/types'

const props = defineProps<{
  component?: DialogState['component']
  componentProps?: DialogState['props']
  componentClose?: DialogState['onClose']
}>()

/**
 *  a11y
 */
const aria = computed(() => {
  const { component } = props

  // If no component is provided, treat as a link
  if (!component) return {}

  // Otherwise treat as a button
  return {
    role: 'button'
  }
})

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
function openDialog(e: PointerEvent) {
  const { component, componentProps, componentClose } = props

  // If no component was provided, of meta key pressed, ignore
  if (!component || isMetaKey(e)) return

  // Else block navigation
  e.preventDefault()

  // And then show the appropriate dialog
  useViewTransition(() => {
    showDialog({
      component,
      props: asObject(componentProps),
      onClose: componentClose
    })
  })
}
</script>