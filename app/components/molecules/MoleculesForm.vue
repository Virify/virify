<template>
  <form ref="$form">
    <MoleculesErrorBox v-if="error" :error />

    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import type { ErrorBoxProp } from '~/types'

defineProps<{ error?: ErrorBoxProp | null }>()

/**
 *  Form setup
 */
const $form = useTemplateRef('$form')

onMounted(() => {
  unref($form).setAttribute('novalidate', true)
})
</script>