<template>
  <label class="| body-sm faded-text">
    Name
    <input ref="$input" type="text" :value="option.name" class="| text-input body-md" required />
  </label>

  <p class="| body-sm">
    {{ option.location }}
  </p>

  <button type="button" class="| button button-xs button-ghost" @click.prevent="removeLocation">
    Delete
  </button>

  <button type="button" class="| button button-xs button-secondary" @click.prevent="updateLocation">
    Update
  </button>
</template>

<script setup lang="ts">
interface Props {
  option: UserSavedLocation
}

const props = defineProps<Props>()

/**
 *  Manage entries
 */
const { deleteEntry, updateEntry } = useSavedLocation();

/**
 *  Delete entry
 */

function removeLocation() {
  const { id, name, location } = props.option

  deleteEntry({ id, name, location })
}

/**
 *  Update entry
 */
const $input = useTemplateRef('$input')

function updateLocation() {

  // Get new name
  const newName = unref($input)?.value

  // Check name has a length
  if (!newName || !newName.length) {
    console.error('Name is required')

    return
  }

  // Update entry
  updateEntry(props.option, newName)
    .catch((error) => {
      console.error('Failed to update saved location', error)
    })
}
</script>