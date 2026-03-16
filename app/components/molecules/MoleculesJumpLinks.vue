<template>
  <nav ref="$root" class="m-jump-links">
    <span aria-hidden class="m-jump-links__indicator"></span>

    <ul class="m-jump-links__list">
      <li v-for="{ icon, title, id, isIntersecting } of sortedLinksWithVisibility">
        <a :href="'#' + id" :title class="m-jump-links__link" :class="{
          'm-jump-links__link--active': isIntersecting
        }">
          <AtomsIcon v-if="icon" :icon />

          <span class="m-jump-links__link-text">
            {{ title }}
          </span>
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

  // Do not recalculate if no active links
  if (!activeLinks.length) return

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
  overflow: auto;
  scrollbar-width: none;
  container-name: jumplinks;
  container-type: inline-size;
  width: 100%;

  &__indicator {
    position: absolute;
    left: v-bind(indicatorX);
    top: 0;
    height: 100%;
    width: v-bind(indicatorWidth);
    background: var(--primary-800);
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

    @container jumplinks (width < 520px) {
      gap: 0
    }
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: currentColor;
    text-decoration: none;
    white-space: nowrap;
    font-weight: var(--font-semibold);
    padding: var(--size-12) var(--size-20);
    gap: var(--size-10);
    line-height: var(--lineheight-xs);

    &:hover {
      background: fn.faded-color(10%);
      color: currentColor;

      @container jumplinks (width < 520px) {
        background: transparent;
      }
    }

    &--active {
      color: var(--primary-200);
    }

    @container jumplinks (width < 520px) {
      padding: var(--size-10) var(--size-14) var(--size-4);
      flex-direction: column;
      gap: 0;
    }

    @container jumplinks (width < 420px) {
      padding: var(--size-8) var(--size-10) var(--size-2);
    }

    @container jumplinks (width < 250px) {
      padding: var(--size-6) var(--size-8) var(--size-2);
    }

    .a-icon {
      width: var(--size-20);
      height: var(--size-20);

      @container jumplinks (width < 420px) {
        width: var(--size-24);
        height: var(--size-24);
      }
    }
  }

  &__link-text {
    font-size: var(--font-sm);

    @container jumplinks (width < 520px) {
      display: block;
      font-size: var(--font-2xs);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @container jumplinks (width < 250px) {
      font-size: 10px;
    }
  }
}
</style>
