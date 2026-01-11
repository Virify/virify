<template>
  <div class="lg:w-auto">
    <OrganismsDashboardFilterMobile
      v-model:isOpen="isOpen"
      :enableTransition="enableTransition"
      :enquiries="enquiries"
      :filter-state="filterState"
      :allConversationsCount="allConversationsCount"
      :unreadConversationsCount="unreadConversationsCount"
    />

    <OrganismsDashboardFilterDesktop
      :enquiries="enquiries"
      :filter-state="filterState"
      :allConversationsCount="allConversationsCount"
      :unreadConversationsCount="unreadConversationsCount"
    />
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
  const props = defineProps<{
    items: T[];
    dateKey?: keyof T;
    enquiries?: boolean;
    userId?: string | number;
    persistenceKey?: string;
  }>();

  // Fetch aggregates from shared notification state
  const { aggregates } = useNotifications();

  // Local component state (not synced with parent)
  const isOpen = ref(false);
  const enableTransition = ref(true);
  const isDesktop = useTailwindDesktop();

  /**
   * Filter composable - provides filter logic and options
   */
  const filterState = useDashboardListFilter(toRef(props, "items"), {
    dateKey: props.dateKey,
    userId: toRef(props, "userId"),
    persistenceKey: props.persistenceKey,
  });

  const { filteredItems, enquiriesFilter } = filterState;

  /**
   * Dynamic counts based on direction filter
   * Calculates appropriate counts from aggregates depending on selected direction
   */
  const allConversationsCount = computed(() => {
    const direction = enquiriesFilter.value || 'all';
    if (direction === 'sent') return aggregates.value.sentEnquiries || 0;
    if (direction === 'received') return aggregates.value.receivedEnquiries || 0;
    return aggregates.value.enquiries || 0;
  });

  const unreadConversationsCount = computed(() => {
    const direction = enquiriesFilter.value || 'all';
    if (direction === 'sent') return aggregates.value.sentUnreadEnquiries || 0;
    if (direction === 'received') return aggregates.value.receivedUnreadEnquiries || 0;
    return aggregates.value.unreadConversations || 0;
  });

  const emit = defineEmits<{
    (e: "update:filtered", value: T[]): void;
  }>();

  /**
   * SYNC PATTERN:
   * 
   * We rely on the composable (cookies) for state management.
   */

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
