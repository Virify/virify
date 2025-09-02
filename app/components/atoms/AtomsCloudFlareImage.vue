<template>
  <nuxt-img
    provider="cloudflare"
    :src="source"
    :alt="alt"
    class="a-cloudflare-image"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  src: string;
  alt?: string;
  variant?: 'public' | 'thumbnail' | 'card' | 'gallery' | 'marker';
  placeholder?: boolean;
}>();

const source = props.src + '/' + (props.variant || 'public');
const placeholder = props.placeholder ? '/img/preload.svg' : undefined;

// Allow all other attributes to be passed through
defineOptions({
  inheritAttrs: false
});
</script>
