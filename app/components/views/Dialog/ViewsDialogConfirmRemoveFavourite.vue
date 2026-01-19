<template>
  <div class="| flow dialog-container dialog-container-sm">
    <h1 class="| title-md">Remove from Favourites?</h1>
    <p class="| body-sm">Are you sure you want to remove this property from your favourites?</p>

    <div class="| flow flow-md">
      <div class="confirm-dialog-actions">
        <button 
          class="| button button-monochrome button-sm button-secondary" 
          @click="onCancel"
          :disabled="isPending"
        >
          Cancel
        </button>
        <button 
          class="| button button-secondary button-sm"
          @click="onConfirm"
          :disabled="isPending"
        >
          {{ isPending ? 'Removing...' : 'Remove' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingId: number
}

const props = defineProps<Props>()
const { hideDialog } = useDialog()
const { removeFromFavourite } = useFavourites()
const { isPending, setPendingWhile } = usePending()

function onCancel() {
  hideDialog({ confirmed: false })
}

async function onConfirm() {
  await setPendingWhile(async () => {
    await removeFromFavourite(props.listingId)
    hideDialog({ confirmed: true })
  })
}
</script>

<style lang="scss">
.confirm-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-8);
  padding: var(--size-8) 0;
}
</style>
