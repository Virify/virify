<template>
  <nuxt-img provider="cloudflare" :src="sourceVariant" :alt="alt" class="a-cloudflare-image"
    :placeholder="placeholder && '/img/preload.svg'" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { joinURL } from 'ufo'

interface Props {
  src: string
  alt?: string
  variant?: 'public' | 'thumbnail' | 'card' | 'gallery' | 'marker' | 'marketing'
  placeholder?: boolean
  // @TODO setting width and height breaks image
  width: number | `${number}`
  height: number | `${number}`
}

const props = defineProps<Props>()

const sourceVariant = computed(() => {
  const { src, variant = 'public' } = props

  return joinURL(src, '/', variant)
})

// Allow all other attributes to be passed through
defineOptions({
  inheritAttrs: false
});
</script>
