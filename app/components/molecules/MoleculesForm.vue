<template>
  <form ref="$form-elem">
    <slot></slot>
  </form>
</template>

<script setup>
/**
 *  Form setup
 */
const $form = useTemplateRef('$form')

onMounted(() => {
  unref($form).setAttribute('novalidate', true)
})
</script>