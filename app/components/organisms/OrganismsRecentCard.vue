<template>
  <div class="card recent-card">
    <AtomsCollapsibleHeader 
      :is-collapsed="isCollapsed" 
      @toggle="$emit('toggle')"
      :title="title" 
      :icon="icon" 
      variant="inline"
    />
    <Transition name="collapse-fade">
      <div v-show="!isCollapsed">
        <ul v-if="items?.length" class="recent-list">
          <li v-for="item in items" :key="item.id">
            <nuxt-link :to="`/listing/${item.listing?.id}`" class="recent-link">
              <MoleculesFeatureTile 
                :title="`Price: £${parseInt(String(item.listing?.price)).toLocaleString()}`"
                :subtitle="item.listing?.property?.address.fullAddress!" 
                :description="item.note"
                :variant="variant"
                :icon-name="iconName"
                :hasBackgroundImage="hasBackgroundImage"
                size="xs" 
              />
            </nuxt-link>
          </li>
        </ul>
        <div v-else class="recent-empty">{{ emptyMessage }}</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isCollapsed: boolean
  title: string
  icon: string
  items?: any[]
  variant?: 'default' | 'primary' | 'blue' | 'secondary' | 'tertiary'
  iconName?: string
  hasBackgroundImage?: boolean
  emptyMessage: string
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()
</script>

<style lang="scss" scoped>
.recent-card {
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .recent-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    padding-top: var(--size-16);
  }

  .recent-empty {
    color: var(--text-muted);
    padding: 1rem 0;
  }
}

.collapse-fade-enter-active,
.collapse-fade-leave-active {
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
  overflow: hidden;
}

.collapse-fade-enter-from,
.collapse-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-fade-enter-to,
.collapse-fade-leave-from {
  max-height: 2000px;
  opacity: 1;
}
</style>