<template>
  <div>
    <ul class="m-paginator | body-xs font-semibold">
      <li class="m-paginator__list-item m-paginator__list-item--previous">
        <button type="button" title="Previous page" class="m-paginator__button m-paginator__button--arrow"
          :disabled="isFirstPage" @click="changePage(currentPage - 1)">
          <AtomsIcon icon="arrow-left" />
        </button>
      </li>
      <li v-for="row of formattedPagination">
        <button v-if="row.type === 'button'" class="m-paginator__button" :class="{
          'm-paginator__button--active': row.page === currentPage
        }" @click="changePage(row.page)">{{ row.page }}</button>
        <span v-else class="m-paginator__ellipsis" aria-hidden>...</span>
      </li>
      <li class="m-paginator__list-item m-paginator__list-item--next">
        <button type="button" title="Next page" class="m-paginator__button m-paginator__button--arrow"
          :disabled="isLastPage" @click="changePage(currentPage + 1)">
          <AtomsIcon icon="arrow-right" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalItems: number
  itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 24
})

/**
 *  Track current state
 */
const pagesCount = computed(() => {
  const { totalItems, itemsPerPage } = props

  if (!isPositiveInteger(totalItems) || !isPositiveInteger(itemsPerPage)) {
    return 1
  }

  return Math.ceil(totalItems / itemsPerPage)
})

const isFirstPage = computed(() => {
  return props.currentPage === 1
})

const isLastPage = computed(() => {
  return props.currentPage === pagesCount.value
})

/**
 *  Update change page
 */
const emits = defineEmits(['change-page'])

function changePage(newIndex: number) {
  emits('change-page', newIndex)
}

/**
 *  Create visual paginating layout
 */
type PaginationButton = { type: 'button', page: number }
type PaginationEllipsis = { type: 'ellipsis' }
type PaginationElement = PaginationButton | PaginationEllipsis

// Get maximum padding between current page and ellipsis
const MAX_VISIBLE = 1;

// Convert offset from start/end to a relative value
function getRelativeOffset(offset: number): number {
  return Math.max((MAX_VISIBLE * 2) - offset, MAX_VISIBLE)
}

// Create pagination items between a start and end index
function createNumberArrayFromXtoY(start: number, end: number): number[] {
  if (!isPositiveInteger(start) || !isPositiveInteger(end)) return []

  return Array.from({
    length: Math.max((end + 1) - start, 1)
  }).map((_, index) => index + start)
}

// Build pagination types so we can render the correct DOM element
function getPaginationType(input: number | '...'): PaginationElement {
  if (input === '...') {
    return {
      type: 'ellipsis'
    } as PaginationEllipsis
  }

  return {
    type: 'button',
    page: input
  } as PaginationElement
}

const formattedPagination = computed(() => {
  const { currentPage } = props

  // Add first and last page
  const firstPageIndex = 1
  const lastPageIndex = pagesCount.value

  // If number of pages is too few to ellipsis, just return entire amount
  // Too few should be double the max visible, plus a buffer of 2 for each
  // side ellipsis that would need to be rendered (if the buffer is 1 then
  // showing an ellipsis would take as much space as showing the number!)
  if (lastPageIndex < 4 + (MAX_VISIBLE * 2)) {
    return createNumberArrayFromXtoY(
      firstPageIndex,
      lastPageIndex,
    ).map(index => getPaginationType(index))
  }

  // Get offsets
  const distanceFromStart = currentPage - firstPageIndex
  const distanceFromEnd = lastPageIndex - currentPage

  // Get ellipsis, with a +1 buffer as ellipsis takes up space
  const ellipsisStart = distanceFromStart > MAX_VISIBLE + 1
  const ellipsisEnd = distanceFromEnd > MAX_VISIBLE + 1

  const maxRelativeOffsetLeft = getRelativeOffset(distanceFromEnd)
  const maxRelativeOffsetRight = getRelativeOffset(distanceFromStart)

  // Get current start, end index of visible pages
  const realCurrentOffsetLeft = currentPage - maxRelativeOffsetLeft
  const realCurrentOffsetRight = currentPage + maxRelativeOffsetRight

  // Get start, end index
  const firstRelativeIndex = Math.max(realCurrentOffsetLeft, firstPageIndex + 1)
  const lastRelativeIndex = Math.min(realCurrentOffsetRight, lastPageIndex - 1)

  // Create array of numbers
  return [
    getPaginationType(firstPageIndex),

    // Conditionally show first ellipsis
    ellipsisStart ? getPaginationType('...') : null,

    // Render visibe pages
    ...createNumberArrayFromXtoY(
      firstRelativeIndex,
      lastRelativeIndex,
    ).map(index => getPaginationType(index)),

    // Conditionally show last ellipsis
    ellipsisEnd ? getPaginationType('...') : null,
    getPaginationType(lastPageIndex)
  ].filter(Boolean) as PaginationElement[]
})

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-paginator {
  display: flex;
  align-items: center;
  list-style: none;
  margin: var(--size-24) 0;
  padding: 0;
  gap: var(--size-4);

  &__list-item {

    &--previous {
      margin-right: auto;
    }

    &--next {
      margin-left: auto;
    }
  }

  &__button,
  &__ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-width: var(--size-24);
    height: var(--size-24);
    border-radius: var(--border-radius-pill);
    padding: var(--size-6);
    box-sizing: content-box;
  }

  &__ellipsis {
    color: #{fn.faded-color(40%)}
  }

  &__button {
    background: transparent;
    color: var(--foreground-200);
    transition: color, background-color;
    transition-duration: var(--animation-fast);

    &:disabled {
      pointer-events: none;
      color: #{fn.faded-color(40%)}
    }

    &:hover:not(:disabled),
    &--active {
      background: var(--primary-700);
    }

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
    }
  }
}
</style>