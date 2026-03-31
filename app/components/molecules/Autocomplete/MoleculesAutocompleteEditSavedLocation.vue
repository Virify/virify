<template>
  <form class="m-autocomplete-edit-saved-location | flow flow-sm elevate-200" @submit.prevent="updateLocation">
    <label class="| body-xs faded-text">
      Name
      <input ref="$input" type="text" v-model="locationValue" class="| text-input body-md" required
        :disabled="isPending || isDeleting" />
    </label>

    <p class="m-autocomplete-edit-saved-location__address | body-sm">
      <AtomsIcon icon="explore/map" />
      {{ entry.location }}
    </p>

    <div class="m-autocomplete-edit-saved-location__buttons">
      <AtomsButton type="button" class="| button button-xs button-delete" :pending="isDeleting"
        :disabled="isPending || isDeleting" @click.prevent="removeLocation">
        Delete
      </AtomsButton>

      <AtomsButton type="submit" class="| button button-xs button-secondary" :pending="isPending"
        :disabled="isPending || isDeleting || !isUpdated">
        Rename
      </AtomsButton>
    </div>
  </form>
</template>

<script setup lang="ts">
interface Props { entry: UserSavedLocation }
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'updated', name: string): void; (e: 'deleted', id: number): void }>()

/**
 *  Check if location name is updated
 */
const locationValue = defineModel({
  default: (props: Props) => {
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
const { isPending: isDeleting, setPendingWhile: setPendingWhileDeleting } = usePending()
const { addEntry, deleteEntry, updateEntryName } = useSavedLocation();

const $input = useTemplateRef('$input')

function removeLocation() {
  const { id } = asObject(props.entry)

  setPendingWhileDeleting(async () => {
    await deleteEntry(id as number)
    emit('deleted', id as number)
  })
}

/**
 *  Update entry
 */
const { isPending, setPendingWhile } = usePending()

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
    if (props.entry?.id) {
      await updateEntryName(props.entry.id as number, name)
      emit('updated', name)
    } else {
      await addEntry({ ...props.entry, name } as UserSavedLocation)
      emit('updated', name)
    }
  })
}
</script>

<style lang="scss">
.m-autocomplete-edit-saved-location {
  padding: var(--size-16);
  border: 1px solid var(--border-color-200);
  border-radius: var(--border-radius-xl);
  background-color: var(--background-100);

  label {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
  }

  &__address {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--size-10);
    line-height: var(--lineheight-sm);
    padding-inline: var(--size-8);
    padding-top: var(--size-8);

    svg {
      width: var(--size-20);
      height: var(--size-20);
    }
  }

  &__buttons {
    display: flex;
    gap: var(--size-10);
    align-items: stretch;
    justify-content: flex-end;

    button {
      white-space: nowrap;
      min-width: 7.5ch;
    }

    button[type="submit"] {
      min-width: 8ch;
    }
  }
}
</style>