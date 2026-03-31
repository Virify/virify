<template>
  <section>
    <Teleport defer :disabled="!isExpanded" :to="$teleport">
      <input type="text" @input="showModalFromRoot" ref="toggle" />
    </Teleport>

    <dialog ref="modal" @toggle="updateExpanded">
      <h2>Hello, World</h2>

      <div role="presentation" ref="teleport"></div>

      <p>Footer</p>
    </dialog>
  </section>
</template>

<script setup lang="ts">
const $modal = useTemplateRef('modal')
const $teleport = useTemplateRef('teleport')
const $toggle = useTemplateRef('toggle')

/**
 *  Toggle and track modal state
 */
const isExpanded = shallowRef(false)

async function updateExpanded({ newState }: ToggleEvent) {
  isExpanded.value = newState === 'open'

  // If modal is closed, do nothing
  if (!isExpanded.value) return

  // Otherwise wait until DOM is updated (teleport is complete)
  await nextTick()

  // And ensure focus on the input is retained
  $toggle.value?.focus()
}

function showModalFromRoot() {
  if (isExpanded.value) return

  console.log('Animate from', $toggle.value)

  showModal()
}

function showModal() {
  $modal.value?.showModal()
}

/**
 *  Allow toggle of search modal from anywhere
 */
function showGlobalSearch({ key, metaKey }: KeyboardEvent) {
  if (!metaKey || key !== 'k') return

  showModal()
}

onMounted(() => {
  window.addEventListener('keydown', showGlobalSearch)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', showGlobalSearch)
})

</script>

<style scoped>
input {
  background: white;
  border: 2px solid red;
}
</style>
