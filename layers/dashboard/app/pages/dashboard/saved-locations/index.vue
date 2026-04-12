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
      <!-- Loading State -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <div v-for="i in 3" :key="i" class="h-full">
          <UPageCard variant="naked" class="p-4 border border-accented/50 bg-elevated/30 rounded-lg h-full animate-pulse">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-lg bg-muted"></div>
              <div class="flex flex-col gap-2 flex-1">
                <div class="h-5 bg-muted rounded w-1/2"></div>
                <div class="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </UPageCard>
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- Saved Locations Grid -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="entries.length > 0">
        <div v-for="location in entries" :key="location.id" class="h-full">
          <OrganismsDashboardListingCardSavedLocation
            :location="location"
            @edit="handleEdit"
            @delete="handleDelete"
            @search="handleSearch"
          />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults v-else type="saved locations" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Saved Locations",
    icon: "i-lucide-map-pin",
  },
  layout: "dashboard",
});

const { entries, getEntries, deleteEntry } = useSavedLocation();
const { setLocation } = useSearchState();
const { showDialog } = useDialog();
const toast = useToast();
const router = useRouter();
const loading = ref(true);

// Dialog component for editing
import ViewsDialogSavedLocationSingle from "@/components/views/Dialog/ViewsDialogSavedLocationSingle.vue";

onMounted(async () => {
  await getEntries();
  loading.value = false;
});

function handleEdit(location: UserSavedLocation) {
  showDialog({ component: ViewsDialogSavedLocationSingle, props: { entry: location } });
}

async function handleDelete(id: number) {
  try {
    await deleteEntry(id);
    toast.add({
      title: "Success",
      description: "Location deleted successfully",
      color: "success",
      icon: 'i-lucide-map-pin-off',
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to delete location",
      color: "error",
      icon: 'i-lucide-circle-x',
    });
  }
}

function handleSearch(location: UserSavedLocation) {
  // Set the location in search state with full geocoding feature data
  // This includes bbox, boundary, coordinates - everything needed for map visualization
  setLocation(location.geocodingFeature);
  
  // Build the search URL with location name (slug-friendly)
  const locationSlug = encodeURIComponent(location.location.toLowerCase().replace(/\s+/g, '-').replace(/,/g, ''));
  const radius = 5; // Default radius in miles
  
  // Navigate to search - the location data is already in searchState
  router.push(`/search/all/${locationSlug}/${radius}/`);
}
</script>
