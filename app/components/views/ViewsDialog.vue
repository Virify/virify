<template>
  <Teleport to="body">
    <dialog ref="$dialog" class="o-dialog" :class="dialog?.wrapperClassName" @close="afterClosed">
      <button class="o-dialog-backdrop" role="none" tabindex="-1" @click.prevent="close"></button>

      <section v-if="dialog" class="o-dialog-content" :class="dialog.className">
        <button class="o-dialog-close | button button-quiet" aria-label="Close modal" aria-controls="modal"
          @click.prevent="close">
          <AtomsIcon icon="cross" aria-hidden class="o-dialog-close-icon" />
        </button>

        <component :is="dialog.component" v-bind="dialog.props" />
      </section>
    </dialog>
  </Teleport>
</template>

<script setup>
const $dialog = useTemplateRef('$dialog')

/**
 *  Monitor changes in dialog content
 */
const { dialog, hideDialog } = useDialog()
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

.o-dialog {
  position: fixed;
  inset: 0;
  border: 0;
  margin: 0;
  padding: var(--size-32) 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  overflow: auto;
  box-sizing: border-box;
  background: transparent;
}

.o-dialog[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}

.o-dialog::backdrop {
  background-color: fn.faded-color(85%, light-dark(var(--monochrome-300), var(--monochrome-100)));
  animation: fadeDialogIn var(--animation-medium) var(--ease-out);
}

.o-dialog-close {
  position: absolute;
  top: var(--size-8);
  right: var(--size-8);
  padding: var(--size-8);
  width: var(--size-42);
  height: var(--size-42);
}

.o-dialog-close-icon {
  display: block;
  width: var(--size-24);
  height: var(--size-24);
}

.o-dialog-backdrop {
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

:where(.o-dialog-content) {
  position: relative;
  background: light-dark(var(--background-200), var(--background-100));
  color: var(--foreground-200);
  padding: var(--size-28);
  margin: auto;
  width: fit-content;
  max-width: calc(100% - var(--size-32));
  box-sizing: border-box;
  border-radius: var(--size-24);
  animation: fadeTransformDialogIn var(--animation-medium) var(--ease-out);

  @include mq.tablet {
    padding: var(--size-32)
  }

  @include mq.notebook {
    padding: var(--size-36)
  }

  @include mq.desktop {
    padding: var(--size-40)
  }
}

:where(.o-dialog-content > *) {
  max-width: 100%;
}

@keyframes fadeTransformDialogIn {
  from {
    opacity: 0;
    transform: translateY(var(--size-32)) scale(0.98);
  }
}

@keyframes fadeDialogIn {
  from {
    opacity: 0;
  }
}
</style>
