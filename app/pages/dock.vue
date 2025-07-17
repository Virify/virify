<template>
  <div class="| container">
    <h1 class="| title-lg">Dock demo</h1>

    <ul>
      <li>
        <button @click.prevent="updateLayout('grid')">
          Set grid layout
        </button>
      </li>
      <li>
        <button @click.prevent="updateLayout('map')">
          Set map layout
        </button>
      </li>
      <li>
        <button @click.prevent="updateSortOrder('relevance')">
          Sort by relevance
        </button>
      </li>
      <li>
        <button @click.prevent="updateSortOrder('price-asc')">
          Sort by price (ascending)
        </button>
      </li>
      <li>
        <button @click.prevent="updateLocationRadius(0)">
          Set Radius (0)
        </button>
      </li>
      <li>
        <button @click.prevent="updateLocationRadius(40)">
          Set Radius (40)
        </button>
      </li>
      <li>
        <button @click.prevent="addFilters()">
          Add random filters
        </button>
      </li>
      <li>
        <button @click.prevent="clearFilters()">
          Clear filters
        </button>
      </li>
    </ul>

    <pre>{{ state }}</pre>

    <OrganismsDock />
  </div>
</template>

<script setup>
const { state, setLayout, setSortOrder, setLocationRadius, setAiFilters } = useUniversalSearch()

function updateLayout(layout = 'grid') {
  setLayout(layout)
}

function updateSortOrder(sortOrder = 'price-asc') {
  setSortOrder(sortOrder)
}

function updateLocationRadius(num = 0) {
  setLocationRadius(num)
}

function addFilters() {
  setAiFilters([1, 2, 3])
}

function clearFilters() {
  setAiFilters()
}
</script>

<style scoped>
pre {
  min-height: 150vh;
  overflow: hidden;
}
</style>
