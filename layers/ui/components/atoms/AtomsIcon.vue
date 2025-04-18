<template>
  <svg width="24" height="24">
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

  // If no name exists, or is already set to the default value
  if (!name || name === 'icon') {
    return `/sprites/icon.svg#${prefix}`
  }

  // Else use prefix in filename
  return `/sprites/icon-${prefix}.svg#${name}`
})
</script>