<template>
  <teleport to="body">
    <div v-if="open" class="o-site-navigation__drawer is-open" role="dialog" aria-modal="true"
      aria-label="Mobile navigation" id="mobile-nav-drawer" @keydown.esc.stop.prevent="emitClose">
      <div class="o-site-navigation__drawer-overlay" @click="emitClose" />
      <aside ref="panel" class="o-site-navigation__drawer-panel" tabindex="-1">
        <header class="o-site-navigation__drawer-header">
          <NuxtLink to="/" class="o-site-navigation__brand" aria-label="Virify Home" @click="emitClose">
            <AtomsIcon icon="logo/horizontal-colour" width="120" height="36" />
          </NuxtLink>
          <button class="button button-quiet button-sm" aria-label="Close menu" @click="emitClose">✕</button>
        </header>

        <nav class="o-site-navigation__drawer-nav">
          <ul class="o-site-navigation__drawer-list">
            <li v-for="item in primaryItems" :key="item.id" class="o-site-navigation__drawer-item">
              <nuxt-link
                v-if="item.type === 'link' && item.href"
                :to="item.href"
                class="o-site-navigation-link | button button-monochrome button-sm | o-site-navigation__drawer-link"
                @click="emitClose"
              >
                <span class="o-site-navigation__drawer-link-content">
                  <AtomsIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    width="16"
                    height="16"
                    class="o-site-navigation__drawer-icon"
                  />
                  <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
                </span>
              </nuxt-link>

              <button
                v-else-if="item.type === 'button'"
                type="button"
                :class="`o-site-navigation-link | button ${item.buttonClass || 'button-monochrome'} button-sm | o-site-navigation__drawer-link`"
                @click.prevent="handleAction(item.action)"
              >
                <span class="o-site-navigation__drawer-link-content">
                  <AtomsIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    width="16"
                    height="16"
                    class="o-site-navigation__drawer-icon"
                  />
                  <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
                </span>
              </button>

              <details
                v-else-if="item.type === 'dropdown' && hasChildCategories(item)"
                class="o-site-navigation__drawer-group"
              >
                <summary class="o-site-navigation__drawer-summary | body-sm">
                  <span class="o-site-navigation__drawer-summary-content">
                    <AtomsIcon
                      v-if="item.icon"
                      :icon="item.icon"
                      width="16"
                      height="16"
                      class="o-site-navigation__drawer-icon"
                    />
                    <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
                  </span>
                  <AtomsIcon
                    icon="chevron-down"
                    width="16"
                    height="16"
                    class="o-site-navigation__drawer-chevron"
                  />
                </summary>

                <div class="o-site-navigation__drawer-children">
                  <template v-for="cat in item.children || []" :key="cat.id">
                    <div
                      v-if="hasThirdLevel(cat)"
                      class="o-site-navigation__drawer-category"
                    >
                      <div class="o-site-navigation__drawer-category-wrapper">
                        <nuxt-link
                          v-if="cat.href"
                          :to="cat.href"
                          class="o-site-navigation__drawer-category-link | body-sm"
                          @click="emitClose"
                        >
                          <span class="o-site-navigation__drawer-summary-content">
                            <AtomsIcon
                              v-if="cat.icon"
                              :icon="cat.icon"
                              width="14"
                              height="14"
                              class="o-site-navigation__drawer-icon"
                            />
                            <span class="o-site-navigation__drawer-text">{{ cat.label }}</span>
                          </span>
                        </nuxt-link>
                        <span
                          v-else
                          class="o-site-navigation__drawer-category-label | body-sm"
                        >
                          <span class="o-site-navigation__drawer-summary-content">
                            <AtomsIcon
                              v-if="cat.icon"
                              :icon="cat.icon"
                              width="14"
                              height="14"
                              class="o-site-navigation__drawer-icon"
                            />
                            <span class="o-site-navigation__drawer-text">{{ cat.label }}</span>
                          </span>
                        </span>
                        <button
                          type="button"
                          class="o-site-navigation__drawer-category-toggle"
                          :aria-expanded="categoryExpanded[cat.id] || false"
                          @click="toggleCategory(cat.id)"
                        >
                          <AtomsIcon
                            icon="chevron-down"
                            width="14"
                            height="14"
                            class="o-site-navigation__drawer-chevron"
                            :class="{ 'is-expanded': categoryExpanded[cat.id] }"
                          />
                        </button>
                      </div>
                      <div
                        v-if="categoryExpanded[cat.id]"
                        class="o-site-navigation__drawer-sub-list-wrapper"
                      >
                        <ul class="o-site-navigation__drawer-sub-list">
                          <li v-for="guide in cat.children || []" :key="guide.id">
                            <nuxt-link
                              v-if="guide.href"
                              :to="guide.href"
                              class="o-site-navigation__drawer-sub-link | body-sm"
                              @click="emitClose"
                            >
                              <span class="o-site-navigation__drawer-summary-content">
                                <AtomsIcon
                                  v-if="guide.icon"
                                  :icon="guide.icon"
                                  width="14"
                                  height="14"
                                  class="o-site-navigation__drawer-icon"
                                />
                                <span class="o-site-navigation__drawer-text">{{ guide.label }}</span>
                              </span>
                            </nuxt-link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <nuxt-link
                      v-else-if="cat.href"
                      :to="cat.href"
                      class="o-site-navigation__drawer-category-link | body-sm"
                      @click="emitClose"
                    >
                      <span class="o-site-navigation__drawer-summary-content">
                        <AtomsIcon
                          v-if="cat.icon"
                          :icon="cat.icon"
                          width="14"
                          height="14"
                          class="o-site-navigation__drawer-icon"
                        />
                        <span class="o-site-navigation__drawer-text">{{ cat.label }}</span>
                      </span>
                    </nuxt-link>
                    <span v-else class="o-site-navigation__drawer-category-label | body-sm">
                      <span class="o-site-navigation__drawer-summary-content">
                        <AtomsIcon
                          v-if="cat.icon"
                          :icon="cat.icon"
                          width="14"
                          height="14"
                          class="o-site-navigation__drawer-icon"
                        />
                        <span class="o-site-navigation__drawer-text">{{ cat.label }}</span>
                      </span>
                    </span>
                  </template>
                </div>
              </details>

              <nuxt-link
                v-else-if="item.href"
                :to="item.href"
                class="o-site-navigation-link | button button-monochrome button-sm | o-site-navigation__drawer-link"
                @click="emitClose"
              >
                <span class="o-site-navigation__drawer-link-content">
                  <AtomsIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    width="16"
                    height="16"
                    class="o-site-navigation__drawer-icon"
                  />
                  <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
                </span>
              </nuxt-link>
              <span v-else class="o-site-navigation__drawer-plain | body-sm">
                <span class="o-site-navigation__drawer-link-content">
                  <AtomsIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    width="16"
                    height="16"
                    class="o-site-navigation__drawer-icon"
                  />
                  <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
                </span>
              </span>
            </li>
          </ul>

          <div v-if="actionItems.length" class="o-site-navigation__drawer-actions">
            <ul class="o-site-navigation__drawer-action-list">
              <li
                v-for="action in actionItems"
                :key="action.id"
                class="o-site-navigation__drawer-action-item"
              >
                <nuxt-link
                  v-if="action.type === 'link' && action.href"
                  :to="action.href"
                  class="o-site-navigation-link | button button-ghost button-sm | o-site-navigation__drawer-link"
                  @click="emitClose"
                >
                  <span class="o-site-navigation__drawer-link-content">
                    <AtomsIcon
                      v-if="action.icon"
                      :icon="action.icon"
                      width="16"
                      height="16"
                      class="o-site-navigation__drawer-icon"
                    />
                    <span class="o-site-navigation__drawer-text">{{ action.label }}</span>
                  </span>
                </nuxt-link>
                <button
                  v-else-if="action.type === 'button'"
                  type="button"
                  :class="`o-site-navigation-link | button ${action.buttonClass || 'button-ghost'} button-sm | o-site-navigation__drawer-link`"
                  @click.prevent="handleAction(action.action)"
                >
                  <span class="o-site-navigation__drawer-link-content">
                    <AtomsIcon
                      v-if="action.icon"
                      :icon="action.icon"
                      width="16"
                      height="16"
                      class="o-site-navigation__drawer-icon"
                    />
                    <span class="o-site-navigation__drawer-text">{{ action.label }}</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { NavigationItem, NavigationSubItem } from '../../../../shared/types/navigation'

const props = withDefaults(defineProps<{
  open: boolean
  primaryItems: NavigationItem[]
  actionItems: NavigationItem[]
}>(), {
  open: false,
  primaryItems: () => [],
  actionItems: () => [],
})
const emit = defineEmits<{ (e: 'close'): void }>()

const panel = ref<HTMLElement | null>(null)
const categoryExpanded = ref<Record<string, boolean>>({})

const emitClose = () => emit('close')

const handleAction = (fn?: () => void) => {
  if (fn) fn()
  emitClose()
}

function toggleCategory(categoryId: string) {
  categoryExpanded.value[categoryId] = !categoryExpanded.value[categoryId]
}

function hasChildCategories(item: NavigationItem) {
  return Array.isArray(item.children) && item.children.length > 0
}

function hasThirdLevel(category: NavigationSubItem) {
  return Array.isArray(category.children) && category.children.length > 0
}

// Focus management when opening
const previousActive = ref<Element | null>(null)

onMounted(() => {
  if (props.open) trapOpen()
})

onUnmounted(() => {
  releaseTrap()
})

watch(() => props.open, (val) => {
  if (val) trapOpen()
  else releaseTrap()
})

function trapOpen() {
  previousActive.value = document.activeElement
  requestAnimationFrame(() => panel.value?.focus())
  document.documentElement.style.overflow = 'hidden'
}

function releaseTrap() {
  document.documentElement.style.overflow = ''
  if (previousActive.value instanceof HTMLElement) {
    previousActive.value.focus()
  }
}
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media.scss" as mq;

.o-site-navigation__drawer {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  z-index: 1000;

  ul,
  li {
    margin: 0;
    list-style: none;
    padding: 0;
  }

  &-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 1;
    transition: opacity 150ms ease;
  }

  &-panel {
    position: absolute;
    top: 0;
    right: 0;
    width: min(92vw, calc(var(--size-120) * 3 + var(--size-20)));
    height: 100%;
    background: var(--blue-400);
    color: var(--monochrome-900);
    box-shadow: calc(var(--size-8) * -1) 0 var(--size-24) rgba(0, 0, 0, 0.1);
    transform: translateX(0);
    transition: transform 220ms ease;
    display: flex;
    flex-direction: column;
    outline: none;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-16);
    border-bottom: calc(var(--size-2) + var(--size-1)) solid var(--secondary-400);
  }

  &-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--size-20);
    padding: var(--size-12) var(--size-16) var(--size-24);
    overflow-y: auto;
  }

  &-list,
  &-action-list {
    display: grid;
    gap: var(--size-12);
  }

  &-item,
  &-action-item {
    list-style: none;
  }

  &-link {
    width: 100%;
    border-radius: var(--border-radius-lg);
  }

  &-link-content {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    width: 100%;
  }

  &-summary {
    cursor: pointer;
    padding: var(--size-12);
    border-radius: var(--border-radius-lg);
    background: rgba(255, 255, 255, 0.08);
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  &-summary-content {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
  }

  &-icon {
    flex-shrink: 0;
  }

  &-text {
    flex: 1;
  }

  &-group {
    border-radius: var(--border-radius-lg);
    background: rgba(255, 255, 255, 0.04);
  }

  &-chevron {
    transition: transform 0.2s ease;
  }

  &-children {
    display: grid;
    gap: var(--size-12);
    padding: var(--size-8) var(--size-12) var(--size-6);
  }

  &-category {
    background: rgba(255, 255, 255, 0.04);
    border-radius: var(--border-radius-md);

    &-wrapper {
      display: flex;
      align-items: center;
      gap: var(--size-4);
      padding: var(--size-4);
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--border-radius-md);
    }

    &-link {
      flex: 1;
      display: block;
      padding: var(--size-8);
      border-radius: var(--border-radius-md);
      text-decoration: none;
      color: inherit;
      transition: background-color 0.15s ease-in-out;

      &:hover,
      &:focus-visible {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    &-label {
      flex: 1;
      display: block;
      padding: var(--size-8);
      color: inherit;
    }

    &-toggle {
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: inherit;
      cursor: pointer;
      padding: var(--size-16);
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s ease-in-out;

      &:hover,
      &:focus-visible {
        background: rgba(255, 255, 255, 0.08);
      }

      .o-site-navigation__drawer-chevron {
        transition: transform 0.2s ease;
        
        &.is-expanded {
          transform: rotate(180deg);
        }
      }
    }
  }

  &-category-summary {
    cursor: pointer;
    padding: var(--size-10);
    border-radius: var(--border-radius-md);
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    background: rgba(255, 255, 255, 0.02);

    &::-webkit-details-marker {
      display: none;
    }
  }

  &-category-link {
    display: block;
    padding: var(--size-10);
    border-radius: var(--border-radius-md);
    background: rgba(255, 255, 255, 0.04);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, 0.12);
    }
  }

  &-category-label {
    display: block;
    padding: var(--size-10);
    border-radius: var(--border-radius-md);
    background: rgba(255, 255, 255, 0.02);
    color: inherit;
  }

  &-sub-list {
    display: grid;
    gap: var(--size-6);
    padding: 0 var(--size-4) var(--size-4);

    &-wrapper {
      margin-top: var(--size-4);
      padding: var(--size-4);
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--border-radius-md);
    }
  }

  &-sub-link {
    display: block;
    padding: var(--size-8);
    border-radius: var(--border-radius-md);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, 0.12);
    }
  }

  &-actions {
    margin-top: auto;
    padding-top: var(--size-16);
    border-top: var(--size-1) solid rgba(255, 255, 255, 0.2);
  }

  &-action-list {
    gap: var(--size-12);
  }

  &-action-item {
    list-style: none;
  }

  &-plain {
    display: inline-flex;
    width: 100%;
    color: inherit;
  }

  details[open] > summary .o-site-navigation__drawer-chevron {
    transform: rotate(180deg);
  }

  @include mq.desktop {
    display: none;
  }
}
</style>