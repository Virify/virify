<template>
  <SelectRoot v-model="searchState.sortBy" v-model:open="sortSelectOpen">
    <SelectTrigger class="o-dock-inputs-sort__button" v-bind="$attrs">
      <AtomsIcon icon="search/sort" />
      <SelectValue class="o-dock-inputs-sort__button-value | body-sm" placeholder="Select sort order" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent position="popper" align="center" :side-offset="24" side="top" :body-lock="false"
        class="o-dock-inputs-sort__popover">
        <SelectScrollUpButton />

        <SelectViewport class="o-dock-inputs-sort__popover-list">
          <SelectItem v-for="{ key, value } of selectOptionSortOrder" :key :value="value"
            class="o-dock-inputs-sort__popover-option">
            <SelectItemText>
              {{ key }}
            </SelectItemText>

            <SelectItemIndicator />
          </SelectItem>
        </SelectViewport>

        <SelectScrollDownButton />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

/**
 *  Sort order state
 */
const { searchState, sortSelectOpen } = useSearchState()

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-inputs-sort {
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
    background: var(--background-300);
    border-radius: var(--border-radius-2xl);
    padding: var(--size-6) var(--size-12);
    line-height: var(--size-24);
    font-size: var(--font-md);
    font-weight: var(--font-semibold);
    width: 100%;

    .a-icon {
      flex: 0 0 auto;
      width: var(--size-24);
      height: var(--size-24);
    }

    @include mq.tablet {
      font-size: var(--font-sm);
    }

    &[aria-expanded="true"] {
      background: var(--primary-400);
      color: var(--monochrome-900);
    }
  }

  &__button-value {
    display: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 10ch;
    text-align: left;

    @include mq.tablet {
      display: block;
    }
  }

  &__popover {
    background: var(--background-100);
    border-radius: var(--border-radius-2xl);
    box-shadow: var(--elevate-200);
    overflow: hidden;
    z-index: 99;

    @include mq.motion {
      animation: fadeSortPopover var(--animation-medium) var(--ease-out);

      @keyframes fadeSortPopover {
        from {
          opacity: 0;
          transform: translateY(var(--size-32));
        }
      }
    }
  }

  &__popover-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    padding: var(--size-12);
  }

  &__popover-option {
    display: block;
    padding: var(--size-10) var(--size-16);
    border-radius: var(--border-radius-xl);
    font-size: var(--font-md);
    line-height: var(--lineheight-md);
    cursor: pointer;
    user-select: none;

    &:focus,
    &:hover {
      background: var(--background-300);
    }

    &[data-state="checked"] {
      background: var(--primary-400);
      color: var(--monochrome-900);
    }
  }
}
</style>