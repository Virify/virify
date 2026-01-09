<template>
  <div class="flex flex-wrap sm:flex-nowrap gap-2 body-sm items-center">
    <!-- Filter: Sale / Rent -->
    <USelect v-if="!enquiries"
      v-model="saleRentFilter" 
      :items="saleRentOptions" 
      option-attribute="label" 
      value-attribute="value" 
      :highlight="false" 
      color="secondary" 
      size="lg" 
      icon="i-lucide-funnel" 
      :ui="{
        leadingIcon: 'text-secondary',
        itemLeadingIcon: 'text-secondary',
        item: 'data-highlighted:not-data-disabled:text-secondary data-highlighted:not-data-disabled:before:bg-elevated/50'
      }" 
    />

    <USelect v-else
      v-model="enquiriesFilter" 
      :items="enquiriesOptions" 
      option-attribute="label" 
      value-attribute="value" 
      :highlight="false" 
      color="secondary" 
      size="lg" 
      icon="i-lucide-funnel" 
      class="w-40!"
      :ui="{
        leadingIcon: 'text-secondary',
        itemLeadingIcon: 'text-secondary',
        item: 'data-highlighted:not-data-disabled:text-secondary data-highlighted:not-data-disabled:before:bg-elevated/50'
      }" 
    />

    <!-- Sort: Date -->
    <USelect 
      v-model="sortOrderValue" 
      :items="sortOrder" 
      option-attribute="label" 
      value-attribute="value" 
      :highlight="false" 
      color="secondary" 
      size="lg" 
      icon="i-lucide-arrow-down-up" 
      :ui="{
        leadingIcon: 'text-secondary',
        itemLeadingIcon: 'text-secondary',
        item: 'data-highlighted:not-data-disabled:text-secondary data-highlighted:not-data-disabled:before:bg-elevated/50'
      }" 
    />

    <!-- Search -->
    <UInput 
      v-model="searchQuery" 
      icon="i-lucide-search" 
      size="lg" 
      color="secondary" 
      placeholder="Search..." 
      :highlight="false" 
      class="w-100" 
      :ui="{
        base: 'outline-0!',
        leadingIcon: 'text-secondary',
      }" 
    />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
  const props = defineProps<{
    items: T[]
    dateKey?: keyof T
    enquiries?: boolean
    userId?: string | number
  }>()

  const emit = defineEmits<{
    (e: 'update:filtered', value: T[]): void
  }>()

  const { 
    searchQuery, 
    enquiriesFilter,
    enquiriesOptions,
    sortOrderValue, 
    saleRentFilter, 
    sortOrder, 
    saleRentOptions, 
    filteredItems 
  } = useDashboardListFilter(toRef(props, 'items'), { 
    dateKey: props.dateKey,
    userId: toRef(props, 'userId')
  })

  // Emit the filtered results back to the parent whenever they change
  watch(filteredItems, (newVal) => {
    emit('update:filtered', newVal)
  }, { immediate: true })
</script>
