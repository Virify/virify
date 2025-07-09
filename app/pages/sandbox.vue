<template>
  <div class="| container flow flow-lg">
    <h1 class="| title-md">Component Testing Sandbox</h1>

    <div class="| flow">
      <p>Test various UI components and their functionality.</p>
    </div>

    <h2 class="| title-sm">Form Components Test</h2>

    <MoleculesMultiselect :options="options" v-model="selected" @all-unselected="allUnselected"
      @all-selected="allSelected" />

    <h2 class="| title-sm">Accordion multi-select</h2>

    <MoleculesAccordionMultiselect title="House" :options="options" v-model="accordionSelected"
      @expanded="toggleExpanded" />

    <AtomsDivider />

    <h2 class="| title-xs">Debug</h2>

    <pre>Multi-select: {{ selected }}
Accordion multi-select: {{ accordionSelected }}
      </pre>
  </div>
</template>

<script setup lang="ts">
// Form component testing
const selected = ref([])
const accordionSelected = ref([])

const options = [
  { key: 'option1', value: 'Option 1' },
  { key: 'option2', value: 'Option 2' },
  { key: 'option3', value: 'Option 3' },
  { key: 'option4', value: 'Option 4' },
  { key: 'option5', value: 'Option 5' },
]

function allUnselected() {
  console.log('Unselected')
}

function allSelected() {
  console.log('Selected')
}

function toggleExpanded(newValue: any) {
  console.log('Accordion expanded', newValue)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.flow {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flow-lg {
  gap: 2rem;
}

.title-md {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.title-sm {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.title-xs {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>