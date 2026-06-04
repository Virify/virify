<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{
        title: 'title-sm m-0!',
        right: 'flex items-center gap-1',
      }">
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
      <MoleculesDashboardPriceTier @select-tier="handleCreateListing" />

      <!-- Shared Listing Editor Modal -->
      <LazyOrganismsDashboardCreateListingModal ref="listingModal" />
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

const listingModal = ref<{ openForNewListing: (tier: any) => void } | null>(null);

function handleCreateListing(tier: ListingTier) {
  listingModal.value?.openForNewListing(tier);
}
</script>
