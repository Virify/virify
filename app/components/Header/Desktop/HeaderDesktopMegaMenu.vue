<template>
  <div class="header-desktop-mega-menu">
    <ul ref="$headers" class="header-desktop-mega-menu__headers">
      <li v-for="{ label, isCurrent } of selectedTitles">
        <button type="button" @click.prevent="showSection(label)" class="header-desktop-mega-menu__header" :class="{
          'header-desktop-mega-menu__header--selected': isCurrent
        }">
          {{ label }}

          <AtomsIcon icon="chevron-right" />
        </button>
      </li>
    </ul>

    <ul ref="$links" class="header-desktop-mega-menu__sub-links">
      <li v-for="{ isViewAll, href, label } of currentChildren">
        <nuxt-link v-if="isViewAll" :to="href" @keydown.escape.stop="selectParent"
          class="header-desktop-mega-menu__sub-link-title | title-sm">
          {{ currentTitle }}
        </nuxt-link>

        <nuxt-link v-else :to="href" @keydown.escape.stop="selectParent"
          class="header-desktop-mega-menu__sub-link | body-sm">
          {{ label }}
        </nuxt-link>
      </li>
    </ul>

    <nuxt-link :to="href" class="header-desktop-mega-menu__view-all">
      <span class="header-desktop-mega-menu__view-all-text | body-md">
        All {{ label }}

        <AtomsIcon icon="arrow-right" />
      </span>
    </nuxt-link>
  </div>
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
  menu?: MenuItem[]
  label?: string
  href?: string
}

const props = defineProps<Props>()

/**
 *  Track currently-visible children
 */
const currentSelection = ref<string | null>(null)

const currentTitle = computed(() => {
  const menu = asArray(props.menu) as MenuItem[]

  if (!currentSelection.value) {
    const { label } = asObject(menu[0])

    return label
  }

  const { label } = asObject(menu.find((menuItem) => {
    const { label } = asObject(menuItem)

    return label === currentSelection.value
  }))

  return label
})

const selectedTitles = computed(() => {
  const menu = asArray(props.menu) as MenuItem[]

  return menu.map((menuItem) => {
    const { label } = asObject(menuItem)

    return {
      label,
      isCurrent: label === currentTitle.value
    }
  })
})

const currentChildren = computed(() => {
  const menu = asArray(props.menu) as MenuItem[]

  // If no current selection, there are no children to show
  if (!currentTitle.value) return []

  // Else get matching section
  const { children } = asObject(menu.find((menuItem) => {
    const { label } = asObject(menuItem)

    return label === currentTitle.value
  }))

  return asArray(children)
})

/**
 *  Toggle active state
 */
const $links = useTemplateRef('$links')
const $headers = useTemplateRef('$headers')

function showSection(newSelection?: string) {
  if (!newSelection) return

  currentSelection.value = newSelection

  // Focus on first visible link
  nextTick(() => {
    $links.value?.querySelector('a')?.focus()
  })
}

function selectParent() {
  const selectedHeader = $headers.value?.querySelector('.header-desktop-mega-menu__header--selected') as HTMLButtonElement

  selectedHeader?.focus()
}

</script>

<style lang="scss">
.header-desktop-mega-menu {
  display: grid;
  grid-template-columns: 20ch 24ch 18ch;
  grid-gap: var(--size-28);
  align-items: stretch;
  height: min(calc(100vh - var(--header-height) - var(--size-28)), 28ch);
  box-sizing: border-box;

  &__view-all {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    color: var(--monochrome-900);
    background: var(--secondary-400);
    font-weight: var(--font-bold);
    transition: background-color var(--animation-fast);

    &:hover {
      color: var(--monochrome-900);
      background: var(--secondary-500);
    }
  }

  &__view-all-text {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    white-space: nowrap;

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
    }
  }

  &__view-all,
  &__sub-links,
  &__headers {
    padding: var(--size-20) var(--size-28);
    border-radius: var(--border-radius-xl);
  }

  &__headers {
    padding-left: 0;
    padding-right: 0;
  }

  &__sub-links,
  &__headers {
    height: 100%;
    overflow: auto;
    overscroll-behavior: contain;
  }

  &__headers {
    list-style: none;
    margin: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
    text-align: left;
    line-height: var(--lineheight-sm);
    font-weight: var(--font-bold);
    font-size: var(--font-md);
    margin: 0;
    padding: var(--size-8) 0;
    border: 0;
    cursor: pointer;
    transition: color var(--animation-fast);
    width: 100%;
    box-sizing: border-box;

    &--selected,
    &:hover {
      color: var(--secondary-400);
    }

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
      flex-shrink: 0;
    }
  }

  &__sub-links {
    list-style: none;
    margin: 0;
    background: var(--background-200);
  }

  &__sub-link-title {
    display: block;
    line-height: var(--lineheight-sm);
    margin: 0 0 var(--size-12);
    color: var(--secondary-400);
  }

  &__sub-link {
    display: block;
    padding: var(--size-4) 0;
    text-decoration: none;
    font-size: var(--font-sm);
    font-weight: var(--font-semibold);
    color: currentColor;
    transition: color var(--animation-fast);

    &:hover {
      color: var(--secondary-400);
    }
  }
}
</style>