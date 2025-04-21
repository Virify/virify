<template>
  <form ref="form">
    <slot></slot>
  </form>
</template>

<script setup>
/**
 *  Form setup
 */
const $form = useTemplateRef('form')

onMounted(() => {
  unref($form).setAttribute('novalidate', true)
})
</script>