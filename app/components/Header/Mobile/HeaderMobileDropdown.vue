<template>
  <button type="button" @click.prevent="toggleDropdown" class="header-mobile-dropdown | body-md" :class="{
    'header-mobile-dropdown--expanded': isExpanded
  }" :aria-expanded="isExpanded" :aria-controls="dropdownId">
    <AtomsIcon v-if="icon" :icon class="header-mobile-dropdown__icon" />

    {{ label }}

    <AtomsIcon icon="chevron-down" class="header-mobile-dropdown__chevron" />
  </button>

  <HeaderMobileMenu :id="dropdownId" :hidden="!isExpanded" :menu="children" class="header-mobile-dropdown__children" />
</template>

<script setup lang="ts">
interface MenuItem {
  id?: string
  label?: string
  href?: string
  description?: string
  icon?: string
  type?: 'link' | 'dropdown'
  children?: MenuItem[]
}

interface Props {
  icon?: string
  label?: string
  href?: string
  children?: MenuItem[]
}

defineProps<Props>()

/**
 *  a11y
 */
const dropdownId = useId()

/**
 *  Toggle dropdown
 */
const isExpanded = shallowRef(false)

function toggleDropdown() {
  isExpanded.value = !isExpanded.value
}

</script>

<style lang="scss">
.header-mobile-dropdown {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--size-10);
  background: transparent;
  color: currentColor;
  border: 0;
  padding: var(--size-8) 0;
  font-weight: var(--font-bold);
  line-height: var(--lineheight-sm);
  cursor: pointer;
  text-align: left;

  &:hover {
    background: transparent;
    color: currentColor;
  }

  &__children {
    padding-left: var(--size-18);
    margin-bottom: var(--size-18);

    .header-mobile-link {
      font-weight: var(--font-semisemibold);
    }
  }

  &__icon {
    flex-shrink: 0;
    color: var(--secondary-400);
    width: var(--size-18);
    height: var(--size-18);
  }

  &__chevron {
    flex-shrink: 0;
    display: block;
    width: var(--size-24);
    height: var(--size-24);
  }

  &--expanded &__chevron {
    transform: rotate(180deg);
  }
}
</style>