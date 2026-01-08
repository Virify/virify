<template>
  <div class="flex items-center gap-3 w-full px-2 py-2">
    <NuxtImg v-if="item.image" :src="item.image" provider="cloudflare" class="w-10 h-10 rounded object-cover shrink-0" />
    <div v-else class="w-6 h-6 rounded flex items-center justify-center shrink-0">
      <UIcon :name="item.icon" class="text-secondary w-5 h-5" />
    </div>

    <div class="flex flex-col min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <div class="flex flex-col min-w-0 overflow-hidden">
          <span class="truncate font-medium text-gray-900 dark:text-white">{{ item.itemPrice ? numberToCurrency(item.itemPrice) : item.label!.split(",")[0] }}</span>
          <span v-if="item.address" class="truncate text-xs text-gray-500 dark:text-gray-400">
            {{ [item.address.street, item.address.city, item.address.postcode].filter(Boolean).join(", ") }}
          </span>
        </div>
        <div v-if="item.specs" class="flex items-center gap-1 shrink-0">
          <UBadge v-if="item.specs.beds" color="secondary" variant="soft" size="md">{{ item.specs.beds }} Beds</UBadge>
          <UBadge v-if="item.specs.baths" color="secondary" variant="soft" size="md">{{ item.specs.baths }} Baths </UBadge>
        </div>
      </div>
      <div v-if="item.note" class="text-xs truncate">
        <UIcon name="i-lucide-sticky-note" class="w-3 h-3 inline" color="secondary" />
        {{ item.note }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
export interface SearchItemAddress {
  street?: string
  city?: string
  postcode?: string
}

export interface SearchItemSpecs {
  beds?: number
  baths?: number
}

export interface DashboardSearchItem {
  id: string | number
  label?: string
  icon?: string
  image?: string
  itemPrice?: number
  address?: SearchItemAddress
  specs?: SearchItemSpecs
  note?: string
  to?: string
  target?: string
}

interface Props {
  item: DashboardSearchItem;
}

defineProps<Props>();
</script>
