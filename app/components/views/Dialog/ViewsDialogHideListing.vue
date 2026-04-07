<template>
  <div class="| flow dialog-container dialog-container-sm">
    <h1 class="| title-xl">Hide listing</h1>
    <p class="| body-sm">Tell us why this listing isn't relevant (optional). This helps us improve your results.</p>

    <div class="| flow flow-md">
      <textarea
        v-model="reason"
        class="hide-listing-dialog__textarea | body-sm"
        rows="3"
        placeholder="e.g. Already viewed, wrong area, price too high..."
      ></textarea>

      <div class="hide-listing-dialog-actions">
        <button
          class="| button button-monochrome button-sm button-secondary"
          @click="() => hideDialog()"
          :disabled="isPending"
        >
          Cancel
        </button>
        <button
          class="| button button-secondary button-sm"
          @click="handleHide"
          :disabled="isPending"
        >
          {{ isPending ? 'Hiding...' : 'Hide listing' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  listingId: number
}>()

const { hideDialog } = useDialog()
const { hideListing } = useHiddenListings()
const { isPending, setPendingWhile } = usePending()

const reason = ref('')

async function handleHide() {
  await setPendingWhile(async () => {
    await hideListing(props.listingId, reason.value.trim() || undefined)
    hideDialog()
  })
}
</script>

<style lang="scss">
.hide-listing-dialog {
  &__textarea {
    width: 100%;
    padding: var(--size-12);
    border: 1px solid var(--background-300);
    border-radius: var(--border-radius-lg);
    background: var(--background-100);
    resize: vertical;
    min-height: var(--size-80);
    line-height: var(--lineheight-sm);
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--primary-400);
    }
  }

  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--size-8);
  }
}
</style>
