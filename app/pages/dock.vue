<template>
  <div class="| container">
    <h1 class="| title-lg">Dock demo</h1>

    <pre>{{ state }}</pre>

    <OrganismsDock />
  </div>
</template>

<script setup>
const { state } = useUniversalSearch()

</script>

<style scoped>
pre {
  overflow: hidden;
}
</style>
