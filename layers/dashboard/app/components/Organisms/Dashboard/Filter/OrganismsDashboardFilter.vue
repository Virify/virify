<template>
  <div class="lg:w-auto">
    <OrganismsDashboardFilterMobile
      v-model:isOpen="isOpen"
      :enableTransition="enableTransition"
      :enquiries="enquiries"
      v-model:saleRentFilter="saleRentFilter"
      :saleRentOptions="saleRentOptions"
      v-model:enquiriesFilter="enquiriesFilter"
      :enquiriesOptions="enquiriesOptions"
      v-model:sortOrderValue="sortOrderValue"
      :sortOrder="sortOrder"
      v-model:activeTab="activeTab"
      :tabItems="tabItems"
      :allConversationsCount="allConversations.length"
      :unreadConversationsCount="unreadConversationsCount"
      v-model:searchQuery="searchQuery"
    />

    <OrganismsDashboardFilterDesktop
      :enquiries="enquiries"
      v-model:saleRentFilter="saleRentFilter"
      :saleRentOptions="saleRentOptions"
      v-model:enquiriesFilter="enquiriesFilter"
      :enquiriesOptions="enquiriesOptions"
      v-model:sortOrderValue="sortOrderValue"
      :sortOrder="sortOrder"
      v-model:activeTab="activeTab"
      :tabItems="tabItems"
      :allConversationsCount="allConversations.length"
      :unreadConversationsCount="unreadConversationsCount"
      v-model:searchQuery="searchQuery"
      :view="view"
      v-model:activeView="activeView"
      :viewOptions="viewOptions"
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
  }>();

  const { allConversations, unreadConversationsCount } = useConversations();

  const isOpen = ref(false);
  const enableTransition = ref(true);
  const isDesktop = useTailwindDesktop();
  const { searchQuery, enquiriesFilter, enquiriesOptions, sortOrderValue, saleRentFilter, sortOrder, saleRentOptions, filteredItems } = useDashboardListFilter(toRef(props, "items"), {
    dateKey: props.dateKey,
    userId: toRef(props, "userId"),
  });

  const emit = defineEmits<{
    (e: "update:filtered", value: T[]): void;
    (e: "update:view", value: "grid" | "list"): void;
    (e: "update:activeTab", value: "all" | "unread"): void;
  }>();

  /**
   * Active Tab
   */
  const activeTab = computed({
    get: () => props.activeTab || "all",
    set: (val) => emit("update:activeTab", val),
  });

  /**
   * View Options
   */
  const viewOptions = [
    {
      label: "",
      icon: "i-lucide-layout-grid",
      value: "grid",
    },
    {
      label: "",
      icon: "i-lucide-list",
      value: "list",
    },
  ];

  /**
   * Tab Items
   */
  const tabItems = [
    { label: "All", value: "all", icon: "i-lucide-inbox" },
    { label: "Unread", value: "unread", icon: "i-lucide-mail" },
  ];

  /**
   * Active View
   */
  const activeView = computed({
    get: () => props.view || "grid",
    set: (val) => emit("update:view", val as "grid" | "list"),
  });

  /**
  * Watch Filtered Items
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
