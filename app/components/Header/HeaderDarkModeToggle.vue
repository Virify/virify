<template>
  <AtomsSwitcher label="Toggle dark mode" v-model="isDark" />
</template>

<script setup>
import { useDark } from '@vueuse/core'

const isDark = useDark({
  onChanged(isDark) {
    if (import.meta.server) return

    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }
})
</script>