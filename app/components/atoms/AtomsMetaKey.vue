<template>
  <span v-if="!metaKeyIcon" class="| v-skeleton"></span>
  <AtomsIcon v-else :icon="metaKeyIcon" />
</template>

<script setup lang="ts">
const metaKeyIcon = shallowRef<string | false>(false)

onMounted(() => {
  const userOS = useUserPlatform()

  metaKeyIcon.value = userOS === 'apple' ? 'keys/apple' : 'keys/windows'
})
</script>

<style scoped>
:where(span, svg) {
  display: inline-block;
  width: 1em;
  height: 1em
}

:where(span) {
  border-radius: 0.25em;
}
</style>