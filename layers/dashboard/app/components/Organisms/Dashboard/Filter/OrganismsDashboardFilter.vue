<template>
  <OrganismsDashboardFilterEnquiries v-if="enquiries" v-bind="forwardedProps" @update:filtered="$emit('update:filtered', $event)" ref="inner" />
  <OrganismsDashboardFilterListings v-else v-bind="forwardedProps" @update:filtered="$emit('update:filtered', $event)" ref="inner" />
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
  items: T[];
  dateKey?: keyof T;
  enquiries?: boolean;
  userId?: string | number;
  persistenceKey?: string;
  viewOptions?: { label: string; value: string; icon?: string; disabled?: boolean }[];
  allCount?: number;
  unreadCount?: number;
  hideSaleRentFilter?: boolean;
}>();

defineEmits<{ (e: 'update:filtered', value: T[]): void }>();

const inner = useTemplateRef('inner');
const forwardedProps = computed(() => props);

defineExpose({ close: () => inner.value?.close() });
</script>
