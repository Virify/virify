<template>
  <OrganismsDashboardFilterShell ref="shell">
    <!-- Read/unread tabs -->
    <UTabs
      :items="tabItems"
      default-value="all"
      size="xs"
      :content="false"
      v-model="activeTab"
      variant="pill"
      :ui="{
        trigger: 'data-[state=active]:text-white! transition-none',
        list: 'justify-center bg-(--background-100) body-sm',
      }"
    >
      <template #trailing="{ item }">
        <UBadge
          :label="item.value === 'all' ? allConversationsCount : unreadConversationsCount"
          color="primary"
          size="lg"
          class="font-normal"
          :ui="{
            base: 'border-1 border-white text-white',
            label: 'font-light',
          }"
        />
      </template>
    </UTabs>

    <!-- Direction filter (sent/received/all) -->
    <USelect
      v-model="enquiriesFilter"
      :items="directionOptions"
      option-attribute="label"
      value-attribute="value"
      icon="i-lucide-funnel"
      color="secondary"
      variant="ghost"
      size="md"
      class="body-sm"
      :ui="{
        base: 'capitalize cursor-pointer light:bg-(--blue-400)! light:text-white!',
        content: 'z-[60]!',
        group: 'bg-(--blue-100) text-(--foreground-100) p-1',
        item: 'hover:bg-(--background-200)',
      }"
      trailing-icon="i-lucide-chevron-down"
    />

    <!-- Sort -->
    <USelect
      v-model="sortOrderValue"
      :items="sortOrder"
      option-attribute="label"
      value-attribute="value"
      icon="i-lucide-arrow-down-up"
      color="primary"
      variant="ghost"
      size="md"
      class="body-sm"
      :ui="{
        base: 'capitalize cursor-pointer light:bg-(--blue-400)! light:text-white!',
        content: 'z-[60]!',
        group: 'bg-(--background-100) text-(--foreground-100) p-1',
        item: 'hover:bg-(--background-200)',
      }"
      trailing-icon="i-lucide-chevron-down"
    />

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

    <!-- View toggle (desktop only) -->
    <div v-if="currentViewOptions.length > 0" class="ml-auto hidden lg:block">
      <UTabs
        v-model="activeView"
        :items="currentViewOptions"
        :content="false"
        color="primary"
        size="md"
        :ui="{ trigger: 'data-[state=active]:text-white!' }"
      />
    </div>
  </OrganismsDashboardFilterShell>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
  items: T[];
  dateKey?: keyof T;
  userId?: string | number;
  persistenceKey?: string;
  viewOptions?: { label: string; value: string; icon?: string; disabled?: boolean }[];
  allCount?: number;
  unreadCount?: number;
}>();

const emit = defineEmits<{
  (e: 'update:filtered', value: T[]): void;
}>();

const { aggregates } = useNotifications();
const shell = useTemplateRef('shell');

const filterState = useDashboardListFilter(toRef(props, 'items'), {
  dateKey: props.dateKey,
  userId: toRef(props, 'userId'),
  persistenceKey: props.persistenceKey,
  enquiries: true,
});

const {
  filteredItems,
  enquiriesFilter,
  directionOptions,
  sortOrderValue,
  sortOrder,
  activeTab,
  activeView,
  searchQuery,
  tabItems,
  viewOptions: defaultViewOptions,
} = filterState;

const currentViewOptions = computed(() => {
  const options = props.viewOptions || defaultViewOptions;
  return options.map((option) => ({
    ...option,
    icon: option.icon || 'i-lucide-layout-list',
  }));
});

const allConversationsCount = computed(() => {
  if (props.allCount !== undefined) return props.allCount;
  const direction = enquiriesFilter.value || 'all';
  if (direction === 'sent') return aggregates.value.sentEnquiries || 0;
  if (direction === 'received') return aggregates.value.receivedEnquiries || 0;
  return aggregates.value.enquiries || 0;
});

const unreadConversationsCount = computed(() => {
  if (props.unreadCount !== undefined) return props.unreadCount;
  const direction = enquiriesFilter.value || 'all';
  if (direction === 'sent') return aggregates.value.sentUnreadEnquiries || 0;
  if (direction === 'received') return aggregates.value.receivedUnreadEnquiries || 0;
  return aggregates.value.unreadConversations || 0;
});

watch(filteredItems, (newVal) => emit('update:filtered', newVal), { immediate: true });

defineExpose({
  close: () => shell.value?.close(),
});
</script>
