<template>
  <span v-if="!icon" class="a-meta-key a-meta-key--loading | v-skeleton"></span>
  <AtomsIcon v-else :icon class="a-meta-key" />
</template>

<script setup lang="ts">
const { icon } = useSpecialKey()

</script>

<style scoped>
:where(.a-meta-key) {
  display: inline-block;
  width: 1em;
  height: 1em;
}

:where(.a-meta-key--loading) {
  border-radius: 0.25em;
}
</style>