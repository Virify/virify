<template>
  <div class="| container flow flow-lg">
    <h1 class="| title-md">Form tests</h1>

    <p>Testing interactive form elements</p>

    <h2 class="| title-sm">Multi-select</h2>

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

function toggleExpanded(newValue) {
  console.log('Accordion expanded', newValue)
}
</script>