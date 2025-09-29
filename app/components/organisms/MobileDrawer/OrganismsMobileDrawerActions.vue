<template>
  <div class="o-site-navigation__drawer-actions">
    <ul class="o-site-navigation__drawer-action-list">
      <li
        v-for="action in actionItems"
        :key="action.id"
        class="o-site-navigation__drawer-action-item"
      >
        <NuxtLink
          v-if="action.type === 'link' && action.href"
          :to="action.href"
          class="o-site-navigation-link | button button-ghost button-sm | o-site-navigation__drawer-link"
          @click="$emit('close')"
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
        </NuxtLink>
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
</template>

<script setup lang="ts">

defineProps<{
  actionItems: NavigationItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

function handleAction(fn?: () => void) {
  if (fn) fn()
  emit('close')
}
</script>

<style lang="scss" scoped>
.o-site-navigation__drawer-actions {
  padding: var(--size-16);
  margin-top: auto;
}

.o-site-navigation__drawer-action {
  &-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &-item {
    display: flex;
  }
}

.o-site-navigation__drawer-link {
  width: 100%;
  justify-content: flex-start;
  text-decoration: none;
  color: inherit;

  &-content {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    width: 100%;
  }
}

.o-site-navigation__drawer-icon {
  flex-shrink: 0;
}

.o-site-navigation__drawer-text {
  flex: 1;
}
</style>