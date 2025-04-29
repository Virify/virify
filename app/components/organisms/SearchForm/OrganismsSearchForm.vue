<template>
  <form ref="$form" class="o-searchform" tabindex="-1">
    <OrganismsSearchFormCore class="o-searchform-box" />

    <div ref="$popover" class="o-searchform-popover | container container-md elevate-300" hidden>
      <OrganismsSearchFormSuggestions />
    </div>
  </form>
</template>

<script setup>
import { useFocusWithin } from '@vueuse/core'

/**
 *  Popover management
 */
const $form = useTemplateRef('$form')
const $popover = useTemplateRef('$popover')

// VueUse watcher for :focus-within events
const { focused } = useFocusWithin($form)

// Toggle popover as necessary with focus enabled
watch(focused, (containsFocus) => {
  $popover.value.toggleAttribute('hidden', !containsFocus)
})

/**
 *  a11y
 */
const popoverId = useId()
</script>

<style>
.o-searchform {
  position: relative;
  max-width: 32em;
  margin: 0 auto;
}

.o-searchform-box,
.o-searchform-popover {
  background: var(--monochrome-900);
  color: var(--monochrome-100);
  border-radius: var(--border-radius-xl);
  padding: var(--size-12);
}

.o-searchform-box {
  display: flex;
  align-items: center;
  gap: var(--size-12);
}

.o-searchform-popover {
  position: absolute;
  top: calc(100% + var(--size-12));
  left: 50%;
  transform: translateX(-50%);
  width: min(100vw - var(--size-72), 48em);
}

/**
 *  Open animatinos
 */
@starting-style {
  .o-searchform-popover {
    opacity: 0;
    transform: translateX(-50%) translateY(-1em)
  }
}

.o-searchform-popover {
  display: block;
  transition: opacity var(--animation-fast) ease-out, transform var(--animation-fast) ease-out;
}
</style>