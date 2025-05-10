<template>
  <LazyMoleculesTabs class="m-listing-card-content-tabs" :options="tabContent" v-slot="{ content }">
    <p class="| body-sm">{{ content }}</p>
  </LazyMoleculesTabs>
</template>

<script setup lang="ts">
interface Props {
  description: string
}

const props = defineProps<Props>()

const tabContent = computed(() => {
  return [
    { label: 'Description', content: props.description },
    { label: 'Features', content: 'See all features (list format)' },
    { label: 'Amenities', content: 'The amenities, wow! (list format)' },
  ]
})
</script>