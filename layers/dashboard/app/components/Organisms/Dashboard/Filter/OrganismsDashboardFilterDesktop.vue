<template>
  <div class="hidden lg:flex gap-2 items-center flex-wrap w-full">
    <!-- Category Filter -->
    <div v-if="!hideSaleRentFilter" class="relative">
      <USelect
        v-if="!enquiries"
        v-model="saleRentFilter"
        :items="saleRentOptions"
        option-attribute="label"
        value-attribute="value"
        icon="i-lucide-funnel"
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
      
      <USelect
        v-else
        v-model="enquiriesFilter"
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
        v-model="sortOrderValue"
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
      v-model="activeTab"
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
            v-model="searchQuery"
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
    <div v-if="currentViewOptions.length > 0" class="ml-auto hidden md:flex">
      <UTabs
        v-model="activeView"
        :items="currentViewOptions"
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
    filterState: ReturnType<typeof useDashboardListFilter>;
    allConversationsCount: number;
    unreadConversationsCount: number;
    viewOptions?: { label: string; value: string; icon?: string; disabled?: boolean }[];
    hideSaleRentFilter?: boolean;
  }>();

  // Destructure for easier use in template
  const { 
    // State (Refs)
    saleRentFilter,
    enquiriesFilter,
    sortOrderValue,
    activeTab,
    activeView,
    searchQuery,
    // Options
    saleRentOptions,
    directionOptions,
    sortOrder,
    tabItems,
    viewOptions: defaultViewOptions
  } = props.filterState;

  const currentViewOptions = computed(() => {
    const options = props.viewOptions || defaultViewOptions;
    return options.map(option => ({
      ...option,
      icon: option.icon || 'i-lucide-layout-list'
    }));
  });

</script>
