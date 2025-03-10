<script setup lang="ts">
import { useAppConfig } from '#imports'

console.log(useAppConfig().ui.colors)
</script>
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
