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
        }"
        :label="!enquiries ? saleRentFilter : enquiriesFilter"
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
        v-model="enquiriesFilterOriginal"
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
      size="sm"
      class="inline-flex"
      :content="false"
      v-model="activeTabOriginal"
      color="primary"
      :ui="{
        trigger: 'data-[state=active]:text-white!',
        label: 'body-xs',
        list: 'justify-center sm:justify-normal',
      }"
    >
      <template #trailing="{ item }">
        <UBadge
          :label="item.value === 'all' ? allConversationsCount : unreadConversationsCount"
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
}>();

const emit = defineEmits<{
  (e: 'update:saleRentFilter', value: any): void;
  (e: 'update:enquiriesFilter', value: any): void;
  (e: 'update:sortOrderValue', value: string): void;
  (e: 'update:activeTab', value: string): void;
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:activeView', value: string): void;
}>();

const saleRentFilterOriginal = computed({
  get: () => props.saleRentFilter,
  set: (val) => emit('update:saleRentFilter', val),
});

const enquiriesFilterOriginal = computed({
  get: () => props.enquiriesFilter,
  set: (val) => emit('update:enquiriesFilter', val),
});

const sortOrderValueOriginal = computed({
  get: () => props.sortOrderValue,
  set: (val) => emit('update:sortOrderValue', val),
});

const activeTabOriginal = computed({
  get: () => props.activeTab,
  set: (val) => emit('update:activeTab', val),
});

const searchQueryOriginal = computed({
  get: () => props.searchQuery,
  set: (val) => emit('update:searchQuery', val),
});

const activeViewOriginal = computed({
  get: () => props.activeView,
  set: (val) => emit('update:activeView', val),
});

</script>
