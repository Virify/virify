<template>
  <div class="| container">
    <h1 class="| title-lg">Dock demo</h1>

    <OrganismsPaneSlider @boundary-exceeded="updateLayout" :left-slot="showGrid" :right-slot="showMap">
      <template #left v-if="showGrid">
        <pre>{{ state }}</pre>
      </template>

      <template #right v-if="showMap">
        Map
      </template>
    </OrganismsPaneSlider>

    <OrganismsDock />
  </div>
</template>

<script setup>
const { state, setLayout } = useUniversalSearch()

function updateLayout(layout) {
  setLayout(layout === 'left' ? 'map' : 'grid')
}

const showGrid = computed(() => {
  const { layout } = asObject(state.value)

  return layout === 'grid' || layout === 'split'
})

const showMap = computed(() => {
  const { layout } = asObject(state.value)

  return layout === 'map' || layout === 'split'
})

</script>

<style scoped>
pre {
  overflow: hidden;
}
</style>
