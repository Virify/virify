<template>
  <svg width="816" height="231" class="layout-logo">
    <title v-if="title">{{ title }}</title>
    <use :href="iconFile"></use>
  </svg>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String
  },
  icon: {
    type: String,
    required: true
  }
})

const iconFile = computed(() => {
  const { icon } = props

  // Split icon string
  const [prefix, name] = getSplitString(icon, '/')

  // If no name exists, assume prefix is the name
  if (!name) return `/sprites/icon.svg#${prefix}`

  // Else use prefix in filename
  return `/sprites/icon-${prefix}.svg#${name}`
})
</script>