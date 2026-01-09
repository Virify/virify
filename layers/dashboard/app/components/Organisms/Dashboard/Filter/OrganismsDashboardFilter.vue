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
}>();
const { allConversations, loading, unreadConversationsCount } = useConversations();

const isOpen = ref(false);
const enableTransition = ref(true);
const activeTab = ref<"all" | "unread">("all");
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

const tabItems = [
  { label: "All", value: "all", icon: "i-lucide-inbox" },
  { label: "Unread", value: "unread", icon: "i-lucide-mail" },
];

const emit = defineEmits<{
  (e: "update:filtered", value: T[]): void;
  (e: "update:view", value: "grid" | "list"): void;
}>();

const activeView = computed({
  get: () => props.view || "grid",
  set: (val) => emit("update:view", val as "grid" | "list"),
});

const { searchQuery, enquiriesFilter, enquiriesOptions, sortOrderValue, saleRentFilter, sortOrder, saleRentOptions, filteredItems } = useDashboardListFilter(toRef(props, "items"), {
  dateKey: props.dateKey,
  userId: toRef(props, "userId"),
});

// Emit the filtered results back to the parent whenever they change
watch(
  filteredItems,
  (newVal) => {
    emit("update:filtered", newVal);
  },
  { immediate: true }
);

const isDesktop = useTailwindDesktop();
watch(isDesktop, (val) => {
  if (val) {
    enableTransition.value = false;
    isOpen.value = false;
    nextTick(() => {
      enableTransition.value = true;
    });
  }
});

defineExpose({
  close: () => isOpen.value = false
});
</script>
