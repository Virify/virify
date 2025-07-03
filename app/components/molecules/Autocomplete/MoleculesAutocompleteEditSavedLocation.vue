<template>
  <label class="| body-sm faded-text">
    Name
    <input ref="$input" type="text" v-model="locationValue" class="| text-input body-md" required />
  </label>

  <p class="| body-sm">
    {{ entry.location }}
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
  entry: UserSavedLocation
}

const props = defineProps<Props>()

/**
 *  Check if location name is updated
 */
const locationValue = defineModel({
  default: (props) => {
    const { name } = asObject(props.entry)

    return name
  }
})

const isUpdated = computed(() => {
  const { name } = asObject(props.entry)

  return locationValue.value !== name
})

/**
 *  Manage entries
 */
const { addEntry, deleteEntry } = useSavedLocation();

const $input = useTemplateRef('$input')

function removeLocation() {
  const { id } = asObject(props.entry)

  deleteEntry(id as number)
}

/**
 *  Update entry
 */

function updateLocation() {
  const { entry = {} }: { entry?: Record<string, unknown> } = asObject(props)

  // Get new name
  const name = unref($input)?.value

  // Check name has a length
  if (!name || !name.length) {
    console.error('Name is required')

    return
  }

  addEntry({ ...entry, ...{ name } } as UserSavedLocation)
}
</script>