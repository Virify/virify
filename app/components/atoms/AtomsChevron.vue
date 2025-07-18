<template>
  <svg 
    :width="width || 18" 
    :height="height || 18" 
    viewBox="0 0 18 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style="vertical-align: middle;"
  >
    <path 
      v-if="collapsed"
      d="M7 13L11 9L7 5" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      v-else
      d="M5 7L9 11L13 7" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  collapsed?: boolean
  height?: string
  width?: string
}

defineProps<Props>()
</script>