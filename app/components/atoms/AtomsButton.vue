<template>
  <button v-bind="$attrs" class="| button" :class="{
    'button-pending': pending
  }" :disabled="pending">
    <AtomsIcon v-if="pending" title="Pending" icon="animated-dots/animated-dots" />
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup>
defineProps({
  pending: {
    type: Boolean
  }
})
</script>