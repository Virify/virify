<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :ui="{
          title: 'title-sm m-0!',
          right: 'flex items-center gap-4',
        }"
      >
        <template #title> Create a listing </template>
        <template #right>
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardTierTable />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a listing",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});
</script>
