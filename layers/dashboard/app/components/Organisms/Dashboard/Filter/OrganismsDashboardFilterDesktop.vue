<template>
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
          label: 'capitalize',
        }"
        :label="!enquiries ? saleRentFilter : directionFilter"
      />
      <USelect
        v-if="!enquiries"
        v-model="saleRentFilterOriginal"
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
        v-model="directionFilterOriginal"
        :items="directionOptions"
        option-attribute="label"
        value-attribute="value"
        color="primary"
        size="lg"
        class="absolute inset-0 w-full h-full opacity-0 z-10"
        :ui="{
          base: 'w-full h-full capitalize',
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
        :label="sortOrderValueOriginal === 'newest' ? 'Newest First' : 'Oldest First'"
        :ui="{
          base: 'text-white!',
        }"
      />
      <USelect
        v-model="sortOrderValueOriginal"
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
      size="md"
      :content="false"
      v-model="activeTabOriginal"
      color="primary"
      :ui="{
        trigger: 'data-[state=active]:text-white! transition-none',
        label: 'body-sm min-w-10',
        list: 'justify-center sm:justify-normal',
      }"
    >
      <template #trailing="{ item }">
        <UBadge
          :label="item.value === 'all' ? allConversationsCount  : unreadConversationsCount"
          color="primary"
          size="md"
          :ui="{
            base: 'border-1 border-white text-white body-xs',
          }"
        />
      </template>
    </UTabs>

    <!-- Search (Desktop Inline) -->
    <UInput
      v-model="searchQueryOriginal"
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
        v-model="activeViewOriginal"
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
</template>

<script setup lang="ts">
  const props = defineProps<{
    enquiries?: boolean;
    saleRentFilter: any;
    saleRentOptions: any[];
    enquiriesFilter: any;
    enquiriesOptions: any[];
    sortOrderValue: string;
    sortOrder: any[];
    activeTab: string;
    tabItems: any[];
    allConversationsCount: number;
    unreadConversationsCount: number;
    searchQuery: string;
    view?: "grid" | "list";
    activeView: string;
    viewOptions: any[];
    directionFilter: string;
    directionOptions: any[];
  }>();

  const emit = defineEmits<{
    (e: 'update:saleRentFilter', value: any): void;
    (e: 'update:enquiriesFilter', value: any): void;
    (e: 'update:sortOrderValue', value: string): void;
    (e: 'update:activeTab', value: string): void;
    (e: 'update:searchQuery', value: string): void;
    (e: 'update:activeView', value: string): void;
    (e: 'update:directionFilter', value: string): void;
  }>();

  /**
   * Computed Bindings for v-model Props
   */
  const saleRentFilterOriginal = usePropModel(props, 'saleRentFilter', emit);
  const enquiriesFilterOriginal = usePropModel(props, 'enquiriesFilter', emit);
  const sortOrderValueOriginal = usePropModel(props, 'sortOrderValue', emit);
  const activeTabOriginal = usePropModel(props, 'activeTab', emit);
  const searchQueryOriginal = usePropModel(props, 'searchQuery', emit);
  const activeViewOriginal = usePropModel(props, 'activeView', emit);
  const directionFilterOriginal = usePropModel(props, 'directionFilter', emit);

</script>
