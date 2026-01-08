<template>
  <UDashboardNavbar :title="title" class="body-sm border-0" :ui="{
    title: 'title-sm m-0!',
    icon: 'text-secondary',
  }">
    <template #right>
      <TooltipProvider :delay-duration="400">
        <UTooltip text="Search to quickly view your saved listings details">
          <UDashboardSearchButton color="neutral" variant="outline" size="xs" label="Quick view search..." />
        </UTooltip>
      </TooltipProvider>
    </template>
  </UDashboardNavbar>
</template>
<script lang="ts" setup>
interface Props {
  title: string;
}

defineProps<Props>();
</script>