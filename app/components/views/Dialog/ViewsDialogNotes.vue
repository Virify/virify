<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">{{ title }}</h1>
    <p class="| body-sm">{{ content }}</p>

    <div class="| flow flow-md">
      <textarea v-model="notes" class="| body-sm" rows="4" placeholder="Enter your notes here..."></textarea>

      <div class="| flex justify-between">
        <button v-if="hasExistingNote" class="| button button-delete button-sm" @click="handleDeleteNote"
          :disabled="isPending">
          {{ isPending ? 'Deleting...' : 'Delete note' }}
        </button>
        <div class="| flex gap-2">
          <button class="| button button-ghost button-sm" @click="() => hideDialog()" :disabled="isPending">
            Cancel
          </button>
          <button class="| button button-secondary button-sm" @click="saveNotes" :disabled="isPending || !notes.trim()">
            {{ isPending ? 'Saving...' : hasExistingNote ? 'Update note' : 'Create notes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  listingId: number
}>()

const { hideDialog } = useDialog()
const { getNote, updateNote, deleteNote, hasNote } = useNotes()
const { isPending, setPendingWhile } = usePending()
const notes = ref('')

/**
 * Computed property to check if the note exists for the given listing ID
 */
const hasExistingNote = computed(() => hasNote(props.listingId))

/**
 * Dynamic title based on whether we're editing or creating a note
 */
const title = computed(() => hasExistingNote.value ? 'Note' : 'Add notes')
const content = computed(() => hasExistingNote.value ? 'View your note on this listing or update it below' : 'Add a new note for this listing.');

/**
 * Load existing note when the component is mounted
 */
onMounted(() => {
  const existingNote = getNote(props.listingId)
  if (existingNote) {
    notes.value = existingNote
  }
})

/**
 * Save notes to the server
 */
async function saveNotes() {
  if (!notes.value.trim()) return

  await setPendingWhile(async () => {
    await updateNote(props.listingId, notes.value.trim())
    hideDialog()
  })
}

/**
 * Delete the note from the server
 */
async function handleDeleteNote() {
  await setPendingWhile(async () => {
    await deleteNote(props.listingId)
    hideDialog()
  })
}
</script>

<style>
textarea {
  width: 100%;
  padding: var(--size-12);
  border: 1px solid var(--background-300);
  border-radius: var(--border-radius-lg);
  background: var(--background-200);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--secondary-400);
  }
}
</style>