<template>
  <ul v-if="hasMenuItems" popover :id="popoverId" class="m-account-popover | box">
    <li class="m-account-popover-listitem" v-for="{ to, label } of options" :key="label">
      <nuxt-link :to="to" class="m-account-popover-link | font-sm">{{ label }}</nuxt-link>
    </li>
  </ul>

  <button ref="button" type="button" class="m-account-popover-toggle | font-sm font-bold" :popovertarget="popoverId"
    :disabled="!hasMenuItems" aria-label="Expand menu">
    Hi, User
    <AtomsIcon width="24" height="24" title="Menu icon" icon="icon/profile" class="m-account-popover-icon" />
  </button>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array
  }
})

/**
 *  Check options length
 */
const hasMenuItems = computed(() => {
  const { options } = props

  return Array.isArray(options) && options.length
})

/**
 *  a11y
 */
const popoverId = useId()

/**
 *  Elements
 */
const $button = useTemplateRef('button')
</script>

<style scoped lang="scss">
@use '#styles/_utils/functions' as fn;

[popover] {
  position: absolute;
  inset: unset;
  /**
   *  @TODO
   *  Firefox and Safari do not yet support anchor positions, so will
   *  need to revisit interim solutions for this :(
   */
  top: calc(anchor(bottom) + var(--size-4));
  right: anchor(right);
}

.m-account-popover-toggle {
  padding: 0;
  margin: 0;
  border: 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: var(--size-8);
}

.m-account-popover-icon {
  display: block;
  width: var(--size-28);
  height: var(--size-28);
}

.m-account-popover {
  list-style: none;
  margin: 0;
  min-width: 14ch;
  padding: var(--size-8);
  border-radius: var(--size-12);
}

.m-account-popover-link {
  display: block;
  padding: var(--size-6) var(--size-14);
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--size-8);
  background: transparent;
  transition: background-color 0.15s;

  &:hover {
    background: fn.faded-color(6%);
  }
}

/**
 *  Open animatinos
 */
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: translateY(-1em)
  }
}

[popover]:popover-open {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
</style>