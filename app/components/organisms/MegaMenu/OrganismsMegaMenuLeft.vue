<template>
  <div class="o-site-navigation__mega-col o-site-navigation__mega-col--left">
    <OrganismsMegaMenuItem
      v-for="category in categories"
      :key="category.id"
      :to="category.href || '#'"
      :label="category.label"
      :icon="category.icon"
      variant="category"
      :is-active="category.id === activeCategoryId"
      :show-arrow="Boolean(category.children && category.children.length)"
      @mouseenter="select(category.id)"
      @focus="select(category.id)"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">

defineProps<{
  categories: NavigationSubItem[]
  activeCategoryId: string | null
}>()

const emit = defineEmits<{ 
  select: [categoryId: string | null]
  close: []
}>()

function select(categoryId: string | null) {
  emit('select', categoryId)
}
</script>

<style lang="scss" scoped>
.o-site-navigation {
  &__mega-col--left {
    padding-right: var(--size-12);
  }
}
</style>
