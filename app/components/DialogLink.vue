<template>
  <nuxt-link v-bind="$attrs" @click.native="openDialog">
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
 *  Open dialog
 */
function openDialog(e) {
  const { component } = props

  console.log('Open dialog', { component })
}
</script>