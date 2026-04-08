<template>
  <OrganismsDashboardFilterShell ref="shell">
    <!-- Category + Sort on same row -->
    <div class="flex items-center gap-2 w-full">
      <div v-if="!hideSaleRentFilter" class="flex-1">
        <USelect
          v-model="saleRentFilter"
          :items="saleRentOptions"
          option-attribute="label"
          value-attribute="value"
          icon="i-lucide-funnel"
          color="primary"
          variant="ghost"
          size="md"
          class="body-sm w-full"
          :ui="{
            base: 'capitalize cursor-pointer light:bg-(--blue-400)! light:text-white!',
            content: 'z-[60]!',
            group: 'bg-(--blue-100) text-(--foreground-100) p-1',
            item: 'hover:bg-(--background-200)',
          }"
          trailing-icon="i-lucide-chevron-down"
        />
      </div>

      <USelect
        v-model="sortOrderValue"
        :items="sortOrder"
        option-attribute="label"
        value-attribute="value"
        icon="i-lucide-arrow-down-up"
        color="primary"
        variant="ghost"
        size="md"
        class="body-sm max-w-36"
        :ui="{
          base: 'capitalize cursor-pointer light:bg-(--blue-400)! light:text-white!',
          content: 'z-[60]!',
          group: 'bg-(--background-100) text-(--foreground-100) p-1',
          item: 'hover:bg-(--background-200)',
        }"
        trailing-icon="i-lucide-chevron-down"
      />
    </div>

    <!-- Search -->
    <UInput
      v-model="searchQuery"
      variant="subtle"
      icon="i-lucide-search"
      color="secondary"
      placeholder="Search..."
      :highlight="false"
      size="md"
      class="body-sm flex-1 min-w-40"
      :ui="{
        base: 'focus-visible:outline-0! outline-primary ring-primary!',
      }"
    />

  </OrganismsDashboardFilterShell>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
  items: T[];
  dateKey?: keyof T;
  persistenceKey?: string;
  hideSaleRentFilter?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filtered', value: T[]): void;
}>();

const shell = useTemplateRef('shell');

const filterState = useDashboardListFilter(toRef(props, 'items'), {
  dateKey: props.dateKey,
  persistenceKey: props.persistenceKey,
});

const {
  filteredItems,
  saleRentFilter,
  saleRentOptions,
  sortOrderValue,
  sortOrder,
  searchQuery,
} = filterState;

watch(filteredItems, (newVal) => emit('update:filtered', newVal), { immediate: true });

defineExpose({
  close: () => shell.value?.close(),
});
</script>
