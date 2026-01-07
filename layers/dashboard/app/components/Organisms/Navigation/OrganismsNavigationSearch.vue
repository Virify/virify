<template>
  <UDashboardNavbar :title="title" class="body-sm border-0" :ui="{
    title: 'title-sm m-0!',
    icon: 'text-secondary',
  }">
    <template #right>
      <UDashboardSearchButton color="neutral" variant="outline" size="xs" label="Search..." />
    </template>
  </UDashboardNavbar>
</template>
<script lang="ts" setup>
interface Props {
  title: string;
}

defineProps<Props>();
</script>