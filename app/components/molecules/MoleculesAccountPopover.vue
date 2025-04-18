<template>
  <div class="| relative">
    <ul v-if="hasMenuItems" popover :id="popoverId" class="m-account-popover | box">
      <li class="m-account-popover-listitem" v-for="{ to, label } of options" :key="label">
        <nuxt-link :to="to">{{ label }}</nuxt-link>
      </li>
    </ul>

    <button ref="button" type="button" class="m-account-popover-toggle" :popovertarget="popoverId"
      :disabled="!hasMenuItems" aria-label="Expand menu">
      <AtomsIcon width="24" height="24" title="Menu icon" icon="icon/menu-dots" class="m-account-popover-icon" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array
  },
  profileImage: {
    type: String
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

<style scoped>
[popover] {
  position: absolute;
  inset: unset;
  top: calc(100% + var(--size-4));
  right: 0;
}

.m-account-popover-toggle {
  padding: var(--size-8);
  border-radius: var(--size-6);
}

.m-account-popover-icon {
  display: block;
  width: var(--size-24);
  height: var(--size-24);
}

.m-account-popover {
  list-style: none;
  margin: 0;
  min-width: 14ch;
  padding: var(--size-12);
}
</style>