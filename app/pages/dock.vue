<template>
  <div class="| container">
    <h1 class="| title-lg">Dock demo</h1>

    <OrganismsPaneSlider @boundary-exceeded="updateLayout" :left-slot="showGrid" :right-slot="showMap">
      <template #left v-if="showGrid">
        <pre>{{ state }}</pre>
      </template>

      <template #right v-if="showMap">
        <div class="p-dock__map">
          Map
        </div>
      </template>
    </OrganismsPaneSlider>

    <footer class="p-dock__demo-footer">
      <p class="| body-sm">Copy &copy; Virify</p>
    </footer>

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
  width: 100%;
  box-sizing: border-box;
  background-color: lightpink;
  border-radius: var(--border-radius-2xl);
  padding: var(--size-32);
  overflow: hidden;
}
</style>

<style lang="scss">
.p-dock {

  &__map {
    position: sticky;
    top: calc(var(--header-height) + var(--size-8));
    height: calc(100vh - var(--header-height) - var(--size-16));
    width: 100%;
    background: var(--monochrome-400);
    border-radius: var(--border-radius-2xl);

    // For demo
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--monochrome-500);
    font-size: var(--font-5xl);
    font-weight: var(--font-semibold);
  }

  &__demo-footer {
    margin: var(--size-48) 0 0;
    padding: var(--size-16) 0;
  }
}
</style>
