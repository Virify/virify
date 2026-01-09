<template>
  <div class="lg:w-auto">
    <!-- Mobile: Popover -->
    <div class="lg:hidden w-full">
      <UButton block variant="solid" color="primary" class="justify-between body-sm text-white!" size="sm" :icon="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" trailing @click="isOpen = !isOpen">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-filter" class="w-5 h-5" />
          <span class="text-white">Filters</span>
        </div>
      </UButton>

      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          :leave-active-class="enableTransition ? 'transition duration-150 ease-in' : ''"
          :leave-from-class="enableTransition ? 'transform translate-y-0 opacity-100' : ''"
          :leave-to-class="enableTransition ? 'transform -translate-y-2 opacity-0' : ''"
        >
          <div v-if="isOpen" class="fixed inset-x-0 top-[calc(var(--header-height,64px)-1px)] z-1">
            <div class="p-4 flex flex-col gap-2 bg-default border-b border-gray-200 dark:border-gray-800">
              <div class="flex flex-row justify-between items-center w-full">
                <div class="flex flex-row gap-2">
                  <!-- Category Filter -->
                  <div class="relative inline-flex">
                    <UButton
                      icon="i-lucide-funnel"
                      color="primary"
                      variant="solid"
                      size="lg"
                      block
                      class="body-sm truncate"
                      :ui="{
                        base: 'text-white!',
                      }"
                      :label="!enquiries ? saleRentFilter : enquiriesFilter"
                    />
                    <USelect
                      v-if="!enquiries"
                      v-model="saleRentFilter"
                      :items="saleRentOptions"
                      option-attribute="label"
                      value-attribute="value"
                      color="primary"
                      variant="soft"
                      size="lg"
                      class="absolute inset-0 w-full h-full opacity-0 z-10"
                      :ui="{
                        base: 'w-full h-full',
                        content: 'min-w-fit z-[60]!',
                        group: 'p-0!',
                        item: 'outline-0! ring-0! cursor-pointer bg-elevated hover:bg-gray-200 dark:hover:bg-gray-500 hover:rounded',
                        itemLeadingIcon: 'text-primary! dark:text-white/50!',
                      }"
                    />
                    <USelect
                      v-else
                      v-model="enquiriesFilter"
                      :items="enquiriesOptions"
                      option-attribute="label"
                      value-attribute="value"
                      color="primary"
                      size="lg"
                      class="absolute inset-0 w-full h-full opacity-0 z-10"
                      :ui="{
                        base: 'w-full h-full',
                        content: 'min-w-fit z-[60]!',
                        group: 'p-0!',
                        item: 'outline-0! ring-0! cursor-pointer bg-elevated hover:bg-gray-200 dark:hover:bg-gray-500 hover:rounded',
                        itemLeadingIcon: 'text-primary! dark:text-white/50!',
                      }"
                    />
                  </div>

                  <!-- Sort Filter -->
                  <div class="relative inline-flex">
                    <UButton
                      icon="i-lucide-arrow-down-up"
                      color="primary"
                      variant="solid"
                      size="lg"
                      block
                      class="body-sm truncate"
                      :label="sortOrderValue === 'asc' ? 'Oldest' : 'Newest'"
                      :ui="{
                        base: 'text-white!',
                      }"
                    />
                    <USelect
                      v-model="sortOrderValue"
                      :items="sortOrder"
                      option-attribute="label"
                      value-attribute="value"
                      variant="soft"
                      size="lg"
                      class="absolute inset-0 w-full h-full opacity-0 z-10"
                      :ui="{
                        base: 'w-full h-full',
                        content: 'min-w-fit z-[60]!',
                        group: 'p-0!',
                        item: 'outline-0! ring-0! cursor-pointer bg-elevated hover:bg-gray-200 dark:hover:bg-gray-500 hover:rounded',
                        itemLeadingIcon: 'text-primary! dark:text-white/50!',
                      }"
                    />
                  </div>
                </div>

                <!-- Tabs -->
                <UTabs v-if="enquiries"
                  :items="tabItems"
                  default-value="all"
                  size="sm"
                  :content="false"
                  v-model="activeTab"
                  color="primary"
                  :ui="{
                    trigger: 'data-[state=active]:text-white! flex-1',
                    label: 'body-xs',
                    list: 'w-full',
                  }"
                >
                  <template #trailing="{ item }">
                    <UBadge
                      :label="item.value === 'all' ? allConversations.length : unreadConversationsCount"
                      variant="solid"
                      color="primary"
                      size="md"
                      :ui="{
                        base: 'border-1 border-white text-white',
                      }"
                    />
                  </template>
                </UTabs>
              </div>
              
              <!-- Search -->
              <div class="w-full">
                <UInput
                  v-model="searchQuery"
                  variant="subtle"
                  icon="i-lucide-search"
                  color="secondary"
                  placeholder="Search..."
                  :highlight="false"
                  size="lg"
                  class="body-sm w-full"
                  :ui="{
                    base: 'focus-visible:outline-0! outline-primary/50! ring-primary/50!',
                    leadingIcon: 'text-primary dark:text-white!',
                  }"
                />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <!-- Desktop: Inline -->
    <div class="hidden lg:flex gap-2 items-center flex-wrap w-full">
      <!-- Category Filter -->
      <div class="relative inline-flex">
        <UButton
          icon="i-lucide-funnel"
          color="primary"
          variant="solid"
          size="lg"
          class="body-sm"
          :ui="{
            base: 'text-white!',
          }"
          :label="!enquiries ? saleRentFilter : enquiriesFilter"
        />
        <USelect
          v-if="!enquiries"
          v-model="saleRentFilter"
          :items="saleRentOptions"
          option-attribute="label"
          value-attribute="value"
          color="primary"
          variant="soft"
          size="lg"
          class="absolute inset-0 w-full h-full opacity-0 z-10"
          :ui="{
            base: 'w-full h-full',
            content: 'min-w-fit',
            group: 'p-0!',
            item: 'outline-0! ring-0! cursor-pointer bg-elevated hover:bg-gray-200 dark:hover:bg-gray-500 hover:rounded',
            itemLeadingIcon: 'text-primary! dark:text-white/50!',
          }"
        />
        <USelect
          v-else
          v-model="enquiriesFilter"
          :items="enquiriesOptions"
          option-attribute="label"
          value-attribute="value"
          color="primary"
          size="lg"
          class="absolute inset-0 w-full h-full opacity-0 z-10"
          :ui="{
            base: 'w-full h-full',
            content: 'min-w-fit',
            group: 'p-0!',
            item: 'outline-0! ring-0! cursor-pointer bg-elevated hover:bg-gray-200 dark:hover:bg-gray-500 hover:rounded',
            itemLeadingIcon: 'text-primary! dark:text-white/50!',
          }"
        />
      </div>

      <!-- Sort Filter -->
      <div class="relative inline-flex">
        <UButton
          icon="i-lucide-arrow-down-up"
          color="primary"
          variant="solid"
          size="lg"
          class="body-sm"
          :label="sortOrderValue === 'asc' ? 'Oldest First' : 'Newest First'"
          :ui="{
            base: 'text-white!',
          }"
        />
        <USelect
          v-model="sortOrderValue"
          :items="sortOrder"
          option-attribute="label"
          value-attribute="value"
          variant="soft"
          size="lg"
          class="absolute inset-0 w-full h-full opacity-0 z-10"
          :ui="{
            base: 'w-full h-full',
            content: 'min-w-fit',
            group: 'p-0!',
            item: 'outline-0! ring-0! cursor-pointer bg-elevated hover:bg-gray-200 dark:hover:bg-gray-500 hover:rounded',
            itemLeadingIcon: 'text-primary! dark:text-white/50!',
          }"
        />
      </div>

      <UTabs v-if="enquiries"
        :items="tabItems"
        default-value="all"
        size="sm"
        class="inline-flex"
        :content="false"
        v-model="activeTab"
        color="primary"
        :ui="{
          trigger: 'data-[state=active]:text-white!',
          label: 'body-xs',
          list: 'justify-center sm:justify-normal',
        }"
      >
        <template #trailing="{ item }">
          <UBadge
            :label="item.value === 'all' ? allConversations.length : unreadConversationsCount"
            variant="solid"
            color="primary"
            size="md"
            :ui="{
              base: 'border-1 border-white text-white',
            }"
          />
        </template>
      </UTabs>

      <!-- Search (Desktop Inline) -->
      <UInput
        v-model="searchQuery"
        variant="subtle"
        icon="i-lucide-search"
        color="secondary"
        placeholder="Search..."
        :highlight="false"
        size="lg"
        class="w-full order-last md:order-0 md:flex-1 md:w-auto body-sm"
        :ui="{
          base: 'focus-visible:outline-0! outline-primary/50! ring-primary/50!',
          leadingIcon: 'text-primary dark:text-white!',
        }"
      />

      <!-- View Toggle -->
      <div v-if="view" class="ml-auto hidden md:flex">
        <UTabs
          v-model="activeView"
          :items="viewOptions"
          :content="false"
          color="primary"
          size="lg"
          :ui="{
            trigger: 'data-[state=active]:text-white!',
          }"
        />
      </div>
    </div>
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
</script>
