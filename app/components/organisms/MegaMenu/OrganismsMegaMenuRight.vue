<template>
  <div class="o-site-navigation__mega-col o-site-navigation__mega-col--right">
    <OrganismsMegaMenuNestedItem
      v-for="guide in guides"
      :key="guide.id"
      :to="guide.href"
      :label="guide.label"
      :icon="guide.icon"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">

defineProps<{ guides: NavigationThirdItem[] }>()
defineEmits<{ close: [] }>()
</script>

<style lang="scss" scoped>
.o-site-navigation {
  &__mega-col--right {
    padding-left: var(--size-12);
  }
}
</style>
