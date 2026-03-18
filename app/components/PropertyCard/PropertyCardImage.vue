<template>
  <AtomsCloudFlareImage v-if="provider === 'cloudflare'" :src="src" :alt="alt" />
  <nuxt-img v-else :src="src" :alt="alt" />
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  provider: 'cloudflare' | 'local'
  variant: string
}

withDefaults(defineProps<Props>(), {
  provider: 'cloudflare'
})
</script>