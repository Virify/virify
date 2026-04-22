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
          <AtomsIcon icon="arrow-right" />
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
$box-shadow: 0 30px 50px -20px light-dark(rgba(#000, 0.15), rgba(#000, 0.5));

.header-desktop-mega-menu {
  display: grid;
  height: min(calc(100vh - var(--header-height) - var(--size-28)), 30ch);
  grid-template-columns: 1fr 1.5fr 20ch;
  grid-gap: var(--size-28);
  align-items: stretch;
  box-sizing: border-box;

  &__view-all {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    color: var(--monochrome-900);
    background: var(--primary-400);
    font-weight: var(--font-bold);
    transition: background-color var(--animation-fast);
    box-shadow: $box-shadow;

    &:hover {
      color: var(--monochrome-900);
      background: var(--primary-500);
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
    padding: var(--size-24) var(--size-28);
    border-radius: var(--border-radius-xl);
  }

  &__headers {
    list-style: none;
    margin: 0;
    padding: var(--size-20);
    padding-right: var(--size-10);
  }

  &__sub-links,
  &__headers {
    height: 100%;
    overflow: auto;
    overscroll-behavior: contain;
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
      color: var(--primary-400);
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
    background: var(--background-100);
    box-shadow: $box-shadow;
  }

  &__sub-link-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    line-height: var(--lineheight-sm);
    padding: 0 0 var(--size-16);
    margin: 0 0 var(--size-24);
    color: var(--primary-400);
    border-bottom: 1px solid var(--background-400);

    .a-icon {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
      flex-shrink: 0;
    }
  }

  &__sub-link {
    display: block;
    padding: var(--size-6) 0;
    text-decoration: none;
    font-size: var(--font-sm);
    font-weight: var(--font-semibold);
    color: currentColor;
    transition: color var(--animation-fast);

    &:hover {
      color: var(--primary-400);
    }
  }
}
</style>