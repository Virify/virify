<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :ui="{
          title: 'title-sm m-0!',
          right: 'flex items-center gap-1',
        }"
      >
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>

        <template #right>
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardTierTable @create-listing="handleCreateListing" />
      
      <!-- Shared Listing Editor Modal -->
      <OrganismsDashboardCreateListingModal ref="listingModal" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums'

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a listing",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
})

import OrganismsDashboardCreateListingModal from '~~/layers/dashboard/app/components/Organisms/Dashboard/CreateListing/OrganismsDashboardCreateListingModal.vue';

const listingModal = ref<InstanceType<typeof OrganismsDashboardCreateListingModal> | null>(null);

function handleCreateListing(tier: ListingTier) {
  listingModal.value?.openForNewListing(tier);
}
</script>
