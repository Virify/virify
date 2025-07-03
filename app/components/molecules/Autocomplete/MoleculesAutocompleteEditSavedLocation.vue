<template>
  <form @submit.prevent="updateLocation">
    <label class="| body-sm faded-text">
      Name
      <input ref="$input" type="text" v-model="locationValue" class="| text-input body-md" required
        :disabled="isPending" />
    </label>

    <p class="| body-sm">
      {{ entry.location }}
    </p>

    <button type="button" class="| button button-xs button-ghost" :disabled="isPending" @click.prevent="removeLocation">
      Delete
    </button>

    <button type="submit" class="| button button-xs button-secondary" :disabled="isPending || !isUpdated">
      Update
    </button>
  </form>
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

    return name as string
  }
})

const isUpdated = computed(() => {
  const { name } = asObject(props.entry)

  return locationValue.value.length && locationValue.value !== name
})

/**
 *  Manage entries
 */
const { isPending, setPendingWhile } = usePending()
const { addEntry, deleteEntry } = useSavedLocation();

const $input = useTemplateRef('$input')

function removeLocation() {
  const { id } = asObject(props.entry)

  setPendingWhile(async () => {
    await deleteEntry(id as number)
  })
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

  setPendingWhile(async () => {
    await addEntry({ ...entry, ...{ name } } as UserSavedLocation)
  })
}
</script>