<template>
  <div class="| flow dialog-container dialog-container-xs">
    <h1 class="| title-xl">{{ title }}</h1>
    <p class="| body-sm">Name your saved location below</p>

    <div class="| flow flow-md">
      <textarea v-model="locationInput" class="| body-sm" rows="4"
        placeholder="Enter your location name here..."></textarea>
      <button v-if="userSavedLocation" class="| button button-ghost button-sm" @click="handleDelete"
          :disabled="isPending">
          {{ isPending ? 'Deleting...' : 'Delete Location' }}
        </button>
      <div class="| flex justify-between">
        <div class="| flex gap-2">
          <button class="| button button-ghost button-sm" @click="() => hideDialog()" :disabled="isPending">
            Cancel
          </button>
          <button class="| button button-secondary button-sm" @click="saveLocation"
            :disabled="isPending || !locationInput.trim()">
            {{ isPending ? 'Saving...' : 'Save location' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  geocodingLocation?: GeocodingFeature
  userSavedLocation?: UserSavedLocation
}>()

const { hideDialog } = useDialog()
const { updateUserSavedLocation, deleteUserSavedLocation } = useSavedLocation()
const { isPending, setPendingWhile } = usePending()
const locationInput = ref('')

/**
 * Dynamic title based on whether we're editing or creating a note
 */
const title = computed(() => {
  return props.userSavedLocation ? 'Edit Location' : 'Add Location'
})

/**
 * Load existing note when the component is mounted
 */
onMounted(() => {
  if (props.userSavedLocation) {
    // If a location is provided, pre-fill the input with its name
    locationInput.value = props.userSavedLocation.name
  } else {
    // Otherwise, clear the input
    locationInput.value = ''
  }
})

/**
 * Save location to the server
 */
async function saveLocation() {
  const name = locationInput.value.trim();
  if (!name) return;

  const geocodingFeature = props.userSavedLocation?.geocodingFeature ?? props.geocodingLocation;
  const id = props.userSavedLocation?.id;

  await setPendingWhile(async () => {
    await updateUserSavedLocation(geocodingFeature!, name, id);
    hideDialog();
  });
}

/**
 * Delete the location from the server
 */
async function handleDelete() {
  await setPendingWhile(async () => {
    await deleteUserSavedLocation(props.userSavedLocation!);
  });

  hideDialog()
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
    border-color: var(--primary-500);
  }
}
</style>