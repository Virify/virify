<template>
  <nav ref="$root" class="m-jump-links">
    <span aria-hidden class="m-jump-links__indicator"></span>

    <ul class="m-jump-links__list">
      <li v-for="{ title, id, isIntersecting } of sortedLinksWithVisibility">
        <a :href="'#' + id" :title class="m-jump-links__link | button button-ghost button-sm" :class="{
          'm-jump-links__link--active': isIntersecting
        }">
          {{ title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useResizeObserver, watchImmediate } from '@vueuse/core';

interface JumpLink {
  order?: number,
  icon?: null,
  title: string
  id: string
}

interface Props {
  links: JumpLink[]
}

const props = defineProps<Props>()

/**
 *  Get a list of watched IDs
 */
const linksSorted = computed(() => {
  const { links } = props

  if (!Array.isArray(links) || !links.every(isObject)) {
    return []
  }

  return links.sort((a, b) => {
    return a.order && b.order && a.order < b.order ? -1 : 1
  })
})

const watchedIds = computed(() => {
  return linksSorted.value.flatMap(({ id }) => id)
})

const visibleIds = ref<{ [key: string]: boolean }>({})

const sortedLinksWithVisibility = computed(() => {
  return linksSorted.value.map((link) => ({
    ...link,
    isIntersecting: visibleIds.value[link.id]
  }))
})

/**
 *  Mount and observe
 */
let observer: IntersectionObserver;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry) continue

      const { target, isIntersecting } = entry

      if (target.id) {
        visibleIds.value[target.id] = isIntersecting
      }
    }

    nextTick(() => {
      resizeIndicator()
    })
  }, {
    rootMargin: '-100px'
  })

  /**
   *  Watch for ID changes to handle dynamic content
   */
  watchImmediate(watchedIds, (newIds, oldIds) => {
    // Unwatch all old IDs, if they exist
    oldIds?.length && oldIds.forEach(id => {
      const el = document.getElementById(id)

      if (el) observer.unobserve(el)
    })

    // Watch new IDs
    newIds?.length && newIds.forEach(id => {
      const el = document.getElementById(id)

      if (el) observer.observe(el)
    })
  })
})

onBeforeUnmount(() => {
  observer.disconnect()
})

/**
 *  Slider resizer
 */
const $root = useTemplateRef('$root')

const indicatorX = ref('0px')
const indicatorWidth = ref('0px')

function resizeIndicator() {
  const wrapper = $root.value

  if (!wrapper) return

  // Get all active links
  const activeLinks = wrapper.querySelectorAll('.m-jump-links__link--active')

  // Loop through each link and get the min/max X coords
  let minLeft = 0
  let maxRight = 0

  for (const link of activeLinks) {
    const { left, right } = link.getBoundingClientRect()

    minLeft = minLeft ? Math.min(left, minLeft) : left
    maxRight = Math.max(maxRight, right)
  }

  // Get offset for wrapper, recalculate min/max
  const { left } = wrapper.getBoundingClientRect()

  indicatorX.value = Math.max(0, minLeft - left) + 'px'
  indicatorWidth.value = (maxRight - minLeft) + 'px'
}

useResizeObserver($root, resizeIndicator)

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

// Account for fixed header
[id] {
  scroll-margin: 100px;
}

.m-jump-links {
  position: relative;

  &__indicator {
    position: absolute;
    left: v-bind(indicatorX);
    top: 0;
    height: 100%;
    width: v-bind(indicatorWidth);
    background: var(--secondary-800);
    border-radius: var(--border-radius-xl);
    transition: width, left;
    transition-duration: var(--animation-medium);
    transition-timing-function: var(--ease-out);
  }

  &__list {
    position: relative;
    list-style: none;
    display: flex;
    gap: var(--size-4);
    padding: 0;
    margin: 0;
  }

  &__link {
    background: transparent;
    color: currentColor;
    text-decoration: none;

    &:hover {
      background: fn.faded-color(10%);
      color: currentColor;
    }

    &--active,
    &--active:hover {
      color: var(--secondart-400);
    }
  }
}
</style>
