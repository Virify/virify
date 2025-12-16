<template>
  <teleport to="body">
    <Transition name="o-site-navigation__drawer" appear>
      <div
        v-if="open"
        class="o-site-navigation__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        id="mobile-nav-drawer"
        @keydown.esc.stop.prevent="emitClose"
      >
        <div class="o-site-navigation__drawer-overlay" @click="emitClose" />
        <aside ref="panel" class="o-site-navigation__drawer-panel" tabindex="-1">
          <!-- Header -->
          <OrganismsMobileDrawerHeader @close="emitClose" />

          <!-- Navigation -->
          <OrganismsMobileDrawerNav
            :primary-items="primaryItems"
            @close="emitClose"
          />

          <!-- Actions -->
          <OrganismsMobileDrawerActions
            v-if="actionItems.length"
            :action-items="actionItems"
            @close="emitClose"
          />
        </aside>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">

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

const emitClose = () => emit('close')

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
  // Use nextTick to ensure DOM updates have completed
  nextTick(() => {
    if (previousActive.value instanceof HTMLElement && document.contains(previousActive.value)) {
      try {
        previousActive.value.focus()
      } catch (e) {
        // Silently fail if focus is not possible
      }
    }
    previousActive.value = null
  })
}
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media.scss" as mq;

.o-site-navigation__drawer {
  --drawer-duration: 260ms;
  --drawer-easing: cubic-bezier(0.32, 0.72, 0, 1);

  position: fixed;
  inset: 0;
  pointer-events: auto;
  z-index: 1000;

  &-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 1;
    transition: opacity var(--drawer-duration) var(--drawer-easing);
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
    transition: transform var(--drawer-duration) var(--drawer-easing);
    display: flex;
    flex-direction: column;
    outline: none;
  }

  @include mq.desktop {
    display: none;
  }
}
</style>

<style lang="scss">
.o-site-navigation__drawer-enter-active,
.o-site-navigation__drawer-leave-active {
  transition: opacity var(--drawer-duration, 260ms) var(--drawer-easing, cubic-bezier(0.32, 0.72, 0, 1));
}

.o-site-navigation__drawer-enter-from,
.o-site-navigation__drawer-leave-to {
  opacity: 0;
}

.o-site-navigation__drawer-enter-active .o-site-navigation__drawer-overlay,
.o-site-navigation__drawer-leave-active .o-site-navigation__drawer-overlay {
  transition: opacity var(--drawer-duration, 260ms) var(--drawer-easing, cubic-bezier(0.32, 0.72, 0, 1));
}

.o-site-navigation__drawer-enter-from .o-site-navigation__drawer-overlay,
.o-site-navigation__drawer-leave-to .o-site-navigation__drawer-overlay {
  opacity: 0;
}

.o-site-navigation__drawer-enter-active .o-site-navigation__drawer-panel,
.o-site-navigation__drawer-leave-active .o-site-navigation__drawer-panel {
  transition: transform var(--drawer-duration, 260ms) var(--drawer-easing, cubic-bezier(0.32, 0.72, 0, 1));
}

.o-site-navigation__drawer-enter-from .o-site-navigation__drawer-panel,
.o-site-navigation__drawer-leave-to .o-site-navigation__drawer-panel {
  transform: translateX(100%);
}

.o-site-navigation__drawer-leave-active {
  pointer-events: none;
}
</style>