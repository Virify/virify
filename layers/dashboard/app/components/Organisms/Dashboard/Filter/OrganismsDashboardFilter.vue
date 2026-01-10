<template>
  <div class="lg:w-auto">
    <OrganismsDashboardFilterMobile
      v-model:isOpen="isOpen"
      :enableTransition="enableTransition"
      :enquiries="enquiries"
      v-model:saleRentFilter="saleRentFilter"
      :saleRentOptions="saleRentOptions"
      v-model:enquiriesFilter="enquiriesFilter"
      :enquiriesOptions="directionOptions"
      v-model:sortOrderValue="sortOrderValue"
      :sortOrder="sortOrder"
      v-model:activeTab="activeTab"
      :tabItems="tabItems"
      :allConversationsCount="allConversationsCount"
      :unreadConversationsCount="unreadConversationsCount"
      v-model:searchQuery="searchQuery"
      v-model:directionFilter="directionFilterModel"
      :directionOptions="directionOptions"
    />

    <OrganismsDashboardFilterDesktop
      :enquiries="enquiries"
      v-model:saleRentFilter="saleRentFilter"
      :saleRentOptions="saleRentOptions"
      v-model:enquiriesFilter="enquiriesFilter"
      :enquiriesOptions="directionOptions"
      v-model:sortOrderValue="sortOrderValue"
      :sortOrder="sortOrder"
      v-model:activeTab="activeTab"
      :tabItems="tabItems"
      :allConversationsCount="allConversationsCount"
      :unreadConversationsCount="unreadConversationsCount"
      v-model:searchQuery="searchQuery"
      :view="view"
      v-model:activeView="activeView"
      :viewOptions="viewOptions"
      v-model:directionFilter="directionFilterModel"
      :directionOptions="directionOptions"
    />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
  const props = defineProps<{
    items: T[];
    dateKey?: keyof T;
    enquiries?: boolean;
    userId?: string | number;
    view?: "grid" | "list";
    activeTab?: "all" | "unread";
    directionFilter?: "all" | "sent" | "received";
    sortOrder?: "newest" | "oldest";
  }>();

  // Fetch aggregates from shared notification state
  const { aggregates } = useNotifications();

  // Local component state (not synced with parent)
  const isOpen = ref(false);
  const enableTransition = ref(true);
  const isDesktop = useTailwindDesktop();

  /**
   * Filter composable - provides filter logic and options
   * Returns:
   * - searchQuery, sortOrderValue, saleRentFilter, enquiriesFilter (reactive state)
   * - directionOptions, tabItems, viewOptions, sortOrder, saleRentOptions (option arrays)
   * - filteredItems (computed filtered/sorted results)
   */
  const { searchQuery, enquiriesFilter, directionOptions, tabItems, viewOptions, sortOrderValue, saleRentFilter, sortOrder, saleRentOptions, filteredItems } = useDashboardListFilter(toRef(props, "items"), {
    dateKey: props.dateKey,
    userId: toRef(props, "userId"),
  });

  /**
   * Dynamic counts based on direction filter
   * Calculates appropriate counts from aggregates depending on selected direction
   */
  const allConversationsCount = computed(() => {
    const direction = props.directionFilter || 'all';
    if (direction === 'sent') return aggregates.value.sentEnquiries || 0;
    if (direction === 'received') return aggregates.value.receivedEnquiries || 0;
    return aggregates.value.enquiries || 0;
  });

  const unreadConversationsCount = computed(() => {
    const direction = props.directionFilter || 'all';
    if (direction === 'sent') return aggregates.value.sentUnreadEnquiries || 0;
    if (direction === 'received') return aggregates.value.receivedUnreadEnquiries || 0;
    return aggregates.value.unreadConversations || 0;
  });

  const emit = defineEmits<{
    (e: "update:filtered", value: T[]): void;
    (e: "update:view", value: "grid" | "list"): void;
    (e: "update:activeTab", value: "all" | "unread"): void;
    (e: "update:directionFilter", value: "all" | "sent" | "received"): void;
    (e: "update:sortOrder", value: "newest" | "oldest"): void;
  }>();

  /**
   * PROP SYNC PATTERN (computed get/set):
   * These are props passed from parent (e.g., cookies in enquiries page)
   * Child components bind to these with v-model
   * Changes emit back to parent to update the cookie
   */

  /**
   * Active Tab (All/Unread)
   * Source: prop from parent cookie
   */
  const activeTab = computed({
    get: () => props.activeTab || "all",
    set: (val) => emit("update:activeTab", val),
  });

  /**
   * Direction Filter (All/Sent/Received)
   * Source: prop from parent cookie
   */
  const directionFilterModel = computed({
    get: () => props.directionFilter || "all",
    set: (val) => emit("update:directionFilter", val),
  });

  /**
   * Active View (Grid/List)
   * Source: prop from parent cookie
   */
  const activeView = computed({
    get: () => props.view || "grid",
    set: (val) => emit("update:view", val as "grid" | "list"),
  });

  /**
   * COMPOSABLE SYNC PATTERN (initialize + watch):
   * sortOrderValue comes from the filter composable (reactive state)
   * We initialize it from the parent prop, then watch for changes
   * Child components bind directly to sortOrderValue from composable
   * Changes emit back to parent to update the cookie
   */

  // Initialize sort order from parent prop (cookie value)
  if (props.sortOrder) {
    sortOrderValue.value = props.sortOrder;
  }

  // Watch composable's sortOrderValue and sync changes to parent
  watch(sortOrderValue, (newVal) => {
    emit("update:sortOrder", newVal as "newest" | "oldest");
  });

  /**
  * Watch filtered items from composable and emit to parent
  */
  watch(
    filteredItems,
    (newVal) => {
      emit("update:filtered", newVal);
    },
    { immediate: true }
  );

  /**
   * Watch isDesktop
   */
  watch(isDesktop, (val) => {
    if (val) {
      enableTransition.value = false;
      isOpen.value = false;
      nextTick(() => {
        enableTransition.value = true;
      });
    }
  });

  /**
   * Expose Close Method
   */
  defineExpose({
    close: () => isOpen.value = false
  });
</script>
