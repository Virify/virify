<template>
  <div class="lg:hidden ">
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
          <div class="p-4 pt-2 flex flex-col gap-2 bg-default border-b border-gray-200 dark:border-gray-800 justify-between">
            <!-- Tabs & Filters Combined -->
            <div class="flex flex-wrap gap-2 items-center justify-start w-full flex-row-reverse">
              <!-- Tabs -->
              <UTabs v-if="enquiries"
                :items="tabItems"
                default-value="all"
                size="sm"
                :content="false"
                v-model="activeTabOriginal"
                variant="pill"
                class="max-w-80"
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
                  size="lg"
                  class="body-sm text-white"
                  :ui="{
                    base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
                    value: 'text-white',
                    leadingIcon: 'text-white',
                    trailingIcon: 'text-white',
                    content: 'z-[60]!',
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
                  size="lg"
                  class="body-sm text-white"
                  :ui="{
                    base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
                    value: 'text-white',
                    leadingIcon: 'text-white',
                    trailingIcon: 'text-white',
                    content: 'z-[60]!',
                    group: 'bg-(--background-200) text-(--foreground-100) p-1',
                    item: 'hover:bg-(--background-100)',
                  }"
                  trailing-icon="i-lucide-chevron-down"
                />
              </div>

              <!-- Sort Filter -->
              <div class="relative">
                <USelect
                  v-model="sortOrderValueOriginal"
                  :items="sortOrder"
                  option-attribute="label"
                  value-attribute="value"
                  icon="i-lucide-arrow-down-up"
                  color="primary"
                  variant="ghost"
                  size="lg"
                  class="body-sm text-white"
                  :ui="{
                    base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
                    value: 'text-white',
                    leadingIcon: 'text-white',
                    trailingIcon: 'text-white',
                    content: 'z-[60]!',
                    group: 'bg-(--background-200) text-(--foreground-100) p-1',
                    item: 'hover:bg-(--background-100)',
                  }"
                  trailing-icon="i-lucide-chevron-down"
                />
              </div>
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
    directionFilter: string;
    directionOptions: any[];
  }>();

  const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'update:saleRentFilter', value: any): void;
    (e: 'update:enquiriesFilter', value: any): void;
    (e: 'update:sortOrderValue', value: string): void;
    (e: 'update:activeTab', value: string): void;
    (e: 'update:searchQuery', value: string): void;
    (e: 'update:directionFilter', value: string): void;
  }>();

  const isOpenOriginal = usePropModel(props, 'isOpen', emit);
  const saleRentFilterOriginal = usePropModel(props, 'saleRentFilter', emit);
  const sortOrderValueOriginal = usePropModel(props, 'sortOrderValue', emit);
  const activeTabOriginal = usePropModel(props, 'activeTab', emit);
  const searchQueryOriginal = usePropModel(props, 'searchQuery', emit);
  const directionFilterOriginal = usePropModel(props, 'directionFilter', emit);
</script>
