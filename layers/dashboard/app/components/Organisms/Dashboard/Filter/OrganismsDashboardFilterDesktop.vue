<template>
  <div class="hidden lg:flex gap-2 items-center flex-wrap w-full">
    <!-- Category Filter -->
    <div class="relative">
      <USelect
        v-if="!enquiries"
        v-model="saleRentFilterOriginal"
        :items="saleRentOptions"
        option-attribute="label"
        value-attribute="value"
        icon="i-lucide-funnel"
        color="primary"
        variant="subtle"
        size="md"
        class="body-sm text-white"
        :ui="{
          base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
          value: 'text-white',
          leadingIcon: 'text-white',
          trailingIcon: 'text-white',
          group: 'bg-(--background-200) text-(--foreground-100) p-1',
          item: 'hover:bg-(--background-100)',
        }"
        trailing-icon="i-lucide-chevron-down"
      />
      
      <USelect
        v-else
        v-model="directionFilterOriginal"
        :items="directionOptions"
        option-attribute="label"
        value-attribute="value"
        icon="i-lucide-funnel"
        color="secondary"
        variant="ghost"
        size="md"
        class="body-sm text-white"
        :ui="{
          base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
          value: 'text-white',
          leadingIcon: 'text-white',
          trailingIcon: 'text-white',
          group: 'bg-(--background-200) text-(--foreground-100) p-1',
          item: 'hover:bg-(--background-100)',
        }"
        trailing-icon="i-lucide-chevron-down"
      />
    </div>

    <!-- Sort Filter -->
    <div class="relative inline-flex">
      <USelect
        v-model="sortOrderValueOriginal"
        :items="sortOrder"
        option-attribute="label"
        value-attribute="value"
        icon="i-lucide-arrow-down-up"
        color="primary"
        variant="ghost"
        size="md"
        class="body-sm text-white"
        :ui="{
          base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
          value: 'text-white',
          leadingIcon: 'text-white',
          trailingIcon: 'text-white',
          group: 'bg-(--background-200) text-(--foreground-100) p-1',
          item: 'hover:bg-(--background-100)',
        }"
        trailing-icon="i-lucide-chevron-down"
      />
    </div>

    <UTabs v-if="enquiries"
      :items="tabItems"
      default-value="all"
      size="sm"
      :content="false"
      v-model="activeTabOriginal"
      variant="pill"
      :ui="{
        trigger: 'data-[state=active]:text-white! transition-none',
        label: 'body-sm',
        list: 'justify-center bg-(--background-200) p-0',
      }"
    >
      <template #trailing="{ item }">
        <UBadge
          :label="item.value === 'all' ? allConversationsCount  : unreadConversationsCount"
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

    <div class="relative">
      <UPopover>
        <UButton color="primary" variant="solid" size="lg" icon="i-lucide-search" :ui="{
          base: 'cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
          leadingIcon: 'text-white',
        }" />
        <template #content>
          <UInput
            v-model="searchQueryOriginal"
            variant="subtle"
            icon="i-lucide-search"
            color="secondary"
            placeholder="Search..."
            :highlight="false"
            size="md"
            class="w-full order-last md:order-0 md:flex-1 md:w-auto body-sm"
            :ui="{
              root: 'w-150!',
              base: 'focus-visible:outline-0! outline-primary/50! ring-primary/50!',
              leadingIcon: 'text-primary dark:text-white!',
            }"
          />
        </template>
      </UPopover>
    </div>

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
  const sortOrderValueOriginal = usePropModel(props, 'sortOrderValue', emit);
  const activeTabOriginal = usePropModel(props, 'activeTab', emit);
  const searchQueryOriginal = usePropModel(props, 'searchQuery', emit);
  const activeViewOriginal = usePropModel(props, 'activeView', emit);
  const directionFilterOriginal = usePropModel(props, 'directionFilter', emit);

</script>
