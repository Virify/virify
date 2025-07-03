<template>
  <label class="| body-sm faded-text">
    Name
    <input ref="$input" type="text" v-model="locationValue" class="| text-input body-md" required />
  </label>

  <p class="| body-sm">
    {{ location }}
  </p>

  <button type="button" class="| button button-xs button-ghost" @click.prevent="removeLocation">
    Delete
  </button>

  <button type="button" class="| button button-xs button-secondary" :disabled="!isUpdated"
    @click.prevent="updateLocation">
    Update
  </button>
</template>

<script setup lang="ts">
interface Props {
  id: number
  name: string
  location: string
}

const props = defineProps<Props>()

/**
 *  Check if location name is updated
 */
const locationValue = defineModel({
  default: (props) => props.name
})

const isUpdated = computed(() => {
  const { name } = props

  return locationValue.value !== name
})

/**
 *  Manage entries
 */
const { deleteEntry } = useSavedLocation();

/**
 *  Delete entry
 */

function removeLocation() {
  const { id, name, location } = props

  deleteEntry({ id, name, location })
}

/**
 *  Update entry
 */
const $input = useTemplateRef('$input')

function updateLocation() {
  const { id, location } = props

  // Get new name
  const newName = unref($input)?.value

  // Check name has a length
  if (!newName || !newName.length) {
    console.error('Name is required')

    return
  }

  console.log('Update', { id, name: newName, location })
}
</script>