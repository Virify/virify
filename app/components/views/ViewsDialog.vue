<template>
  <Teleport to="#teleports">
    <dialog ref="$dialog" class="o-dialog" :class="dialog?.wrapperClassName" @close="afterClosed">
      <button class="o-dialog-backdrop" role="none" tabindex="-1" @click.prevent="handleBackdropClick"></button>

      <section v-if="dialog" class="o-dialog-window" :class="dialog.className">
        <component :is="dialog.component" v-bind="dialog.props" />

        <button class="o-dialog-close | button button-quiet" aria-label="Close modal" aria-controls="modal"
          @click.prevent="close">
          <AtomsIcon icon="cross" aria-hidden class="o-dialog-close-icon" />
        </button>
      </section>
    </dialog>
  </Teleport>
</template>

<script setup>
import { useScrollLock } from '@vueuse/core'

const $dialog = useTemplateRef('$dialog')
const body = ref(null)

/**
 *  Monitor changes in dialog content
 */
const { dialog, hideDialog } = useDialog()
const isLocked = useScrollLock(body)

onMounted(() => {
  body.value = document.body
  watchEffect(() => {
    if (!dialog.value) {
      $dialog.value.close()
    } else {
      $dialog.value.showModal()
    }
    isLocked.value = !!dialog.value
  })
})

/**
 *  Run the native dialog close function
 */
function close() {
  $dialog.value?.close()
}

/**
 * Handle clicks on the backdrop. If the dialog explicitly opts out
 * of backdrop-close (backdropClose: false) then do nothing.
 */
function handleBackdropClick() {
  if (!dialog?.value) return
  if (dialog.value.backdropClose === false) return
  close()
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
  scrollbar-gutter: stable;
}

.o-dialog[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}

.o-dialog::backdrop {
  background-color: fn.faded-color(85%, light-dark(var(--monochrome-300), var(--monochrome-100)));

  @include mq.motion {
    animation: fadeDialogIn var(--animation-medium) var(--ease-out);
  }
}

.o-dialog-close {
  position: absolute;
  top: var(--size-8);
  right: var(--size-8);
  padding: var(--size-8);
  width: var(--size-42);
  height: var(--size-42);

  &:hover {
    color: var(--foreground-200);
  }
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

:where(.o-dialog-window) {
  position: relative;
  background: light-dark(var(--background-100), var(--background-200));
  color: var(--foreground-200);
  margin: auto;
  width: fit-content;
  max-width: calc(100% - var(--size-32));
  box-sizing: border-box;
  border-radius: var(--border-radius-2xl);
  overflow: hidden;

  @include mq.motion {
    animation: fadeTransformDialogIn var(--animation-medium) var(--ease-out);
  }
}

:where(.o-dialog-window > *) {
  max-width: 100%;
}


/**
 *  Show/hide animations for modals
 */
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

/**
 *  View transitions
 */
@include mq.motion {
  .o-dialog-window {
    view-transition-name: dialog-window;
  }

  ::view-transition-group(dialog-window) {
    animation-duration: var(--animation-fast);
    animation-timing-function: var(--ease-out);
  }

  ::view-transition-old(dialog-window),
  ::view-transition-new(dialog-window) {
    height: 100%;
  }
}
</style>
