<template>
  <ContentRenderer v-if="data" :value="data" class="| container" />
  <div v-else>Home not found</div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData(() => queryCollection('guides').path('/').first());
console.log('index', data.value)

useSeoMeta({
  title: data.value?.title,
  description: data.value?.description
})
</script>
