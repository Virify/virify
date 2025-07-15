<template>
  <Teleport to="#teleports">
    <dialog ref="$dialog" class="v-search-dialog" :class="dialog?.wrapperClassName" @close="afterClosed">
      <button class="v-search-dialog__backdrop" role="none" tabindex="-1" @click.prevent="close"></button>

      <section v-if="dialog" class="v-search-dialog__window" :class="dialog.className">
        <component :is="dialog.component" v-bind="dialog.props" />

        <button class="v-search-dialog__close | button button-quiet" aria-label="Close modal" aria-controls="modal"
          @click.prevent="close">
          <AtomsIcon icon="cross" aria-hidden class="v-search-dialog__close-icon" />
        </button>
      </section>
    </dialog>
  </Teleport>
</template>

<script setup>
const $dialog = useTemplateRef('$dialog')

/**
 *  Monitor changes in dialog content
 */
const { dialog, hideDialog } = useSearchDialog()
const { lock } = useScrollLock()

onMounted(() => {
  watchEffect(() => {
    if (!dialog.value) {
      $dialog.value.close()
    } else {
      $dialog.value.showModal()
    }

    lock(!!dialog.value)
  })
})

/**
 *  Run the native dialog close function
 */
function close() {
  $dialog.value?.close()
}

/**
 *  Post-closed cleanup
 */
function afterClosed() {
  // Avoid duplicate close events
  if (!dialog.value) return

  // Clean up any existing state
  hideDialog()
}

/**
 *  Close modal on route change
 */
watch(useRoute(), close)
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

.v-search-dialog {
  position: fixed;
  inset: 0;
  border: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  overflow: auto;
  box-sizing: border-box;
  background: transparent;
  scrollbar-gutter: stable;

  &::backdrop {
    background-color: fn.faded-color(30%, var(--background-100));

    @include mq.motion {
      animation: fadeSearchDialogIn var(--animation-medium) var(--ease-out);
    }
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    border: 0;
    margin: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;

    // Override default button sizes
    width: 100%;
    height: 100%;
  }

  &__close {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
    padding: var(--size-8);
    width: var(--size-42);
    height: var(--size-42);
  }

  &__close-icon {
    display: block;
    width: var(--size-24);
    height: var(--size-24);
  }
}

:where(.v-search-dialog__window) {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: var(--size-12);
  width: calc(100% - var(--size-24));
  max-height: calc(100dvh - var(--size-24));
  padding: var(--size-16);
  padding-top: var(--size-48);
  margin: 0;
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  z-index: 10;
  overflow: auto;
  scrollbar-width: thin;

  @include mq.tablet {
    $dock-height: 80px;

    max-width: 800px;
    bottom: calc(var(--size-16) + #{ $dock-height });
    max-height: calc(100dvh - var(--size-32) - #{ $dock-height });
    padding: var(--size-32);
    padding-top: var(--size-48);
  }

  @include mq.notebook {
    $dock-height: 80px;

    bottom: calc(var(--size-24) + #{ $dock-height });
    max-height: calc(100dvh - var(--size-48) - #{ $dock-height });
  }

  @include mq.motion {
    animation: fadeTransformSearchDialogIn var(--animation-medium) var(--ease-out);
  }
}

/**
 *  Show/hide animations for modals
 */
@keyframes fadeTransformSearchDialogIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(var(--size-32));
  }
}

@keyframes fadeSearchDialogIn {
  from {
    opacity: 0;
  }
}
</style>
