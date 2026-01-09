<template>
  <div class="lg:hidden w-full">
    <UButton block variant="solid" color="primary" class="justify-between body-sm text-white!" size="sm" :icon="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" trailing @click="isOpenOriginal = !isOpenOriginal">
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
        <div v-if="isOpen" class="fixed inset-x-0 top-[calc(var(--header-height,64px)-1px)] z-20">
          <div class="p-4 flex flex-col gap-2 bg-default border-b border-gray-200 dark:border-gray-800">
            <div class="flex flex-row justify-between items-center w-full flex-wrap">
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
                      content: 'min-w-fit z-[60]!',
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
                    v-model="sortOrderValueOriginal"
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
                size="lg"
                :content="false"
                v-model="activeTabOriginal"
                color="primary"
                :ui="{
                  trigger: 'data-[state=active]:text-white! flex-1',
                  label: 'body-xs',
                  list: 'w-full p-0',
                }"
              >
                <template #trailing="{ item }">
                  <UBadge
                    :label="item.value === 'all' ? allConversationsCount : unreadConversationsCount"
                    variant="solid"
                    color="primary"
                    size="lg"
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
                v-model="searchQueryOriginal"
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
</template>

<script setup lang="ts">
  const props = defineProps<{
    isOpen: boolean;
    enableTransition: boolean;
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
  }>();

  const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'update:saleRentFilter', value: any): void;
    (e: 'update:enquiriesFilter', value: any): void;
    (e: 'update:sortOrderValue', value: string): void;
    (e: 'update:activeTab', value: string): void;
    (e: 'update:searchQuery', value: string): void;
  }>();

  const isOpenOriginal = usePropModel(props, 'isOpen', emit);
  const saleRentFilterOriginal = usePropModel(props, 'saleRentFilter', emit);
  const enquiriesFilterOriginal = usePropModel(props, 'enquiriesFilter', emit);
  const sortOrderValueOriginal = usePropModel(props, 'sortOrderValue', emit);
  const activeTabOriginal = usePropModel(props, 'activeTab', emit);
  const searchQueryOriginal = usePropModel(props, 'searchQuery', emit);
</script>
