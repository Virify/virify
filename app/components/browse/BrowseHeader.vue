<template>
  <div class="browse-header | gradient-box">
    <h2 class="browse-header__title | title-sm">
      Showing {{ count }} results
    </h2>

    <div class="browse-header__overview">
      <ul class="browse-header__active-filters">
        <li>
          <AtomsIcon icon="ai/prompt" class="browse-header__active-filters-icon" />
        </li>

        <li v-if="!filters.length">
          <AtomsPill class="disabled">
            No filters applied
          </AtomsPill>
        </li>

        <li v-for="filter in filters" :key="filter">
          <AtomsPill>
            {{ filter }}
          </AtomsPill>
        </li>
      </ul>

      <button class="browse-header__show-filters | body-sm" @click.prevent="showBrowseForm">
        <AtomsIcon icon="search/filter" />

        Show filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogBrowseForm } from '#components';

interface Props {
  count: number
}

defineProps<Props>()

/**
 *  Filters form
 */
const { showDialog } = useDialog()

function showBrowseForm() {
  showDialog({
    component: ViewsDialogBrowseForm,
    onClose: (e) => {
      console.log('MODAL', e)

      filters.value.push('4 bedrooms', 'House')
    }
  });
}

/**
 *  Search terms
 */
const filters = ref<string[]>([])
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;

.browse-header {
  position: sticky;
  top: calc(var(--size-8) + var(--header-height));
  margin: 0 auto var(--size-16);
  padding: var(--size-12);
  background: var(--background-100);

  &__title {
    padding: 0 var(--size-4);
    margin: 0;
  }

  &__overview {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--size-16);
  }

  &__active-filters {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    margin: 0;
    padding: 0;
    overflow: auto;
    scrollbar-width: thin;

    .a-pill {
      white-space: nowrap;
      background: transparent;
      line-height: var(--lineheight-sm);
      padding: var(--size-4) var(--size-12);
      border: 1px solid var(--background-400);

      &.disabled {
        background: var(--background-200);
        color: #{fn.faded-color(40%)};
      }
    }
  }

  &__active-filters-icon {
    display: block;
    width: var(--size-20);
    height: var(--size-20);
    margin: 0 var(--size-2);
  }

  &__show-filters {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    white-space: nowrap;
    font-weight: var(--font-semibold);
    padding: var(--size-8) var(--size-16);
    border-radius: var(--border-radius-lg);
    background: var(--background-300);
    border: 0;
    cursor: pointer;
    transition: background-color var(--animation-fast);

    &:hover {
      background: var(--background-400);
    }

    .a-icon {
      display: block;
      width: var(--size-20);
      height: var(--size-20);
    }
  }
}
</style>