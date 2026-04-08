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
          <OrganismsDashboardFilterEnquiries
            ref="filterRef"
            :items="filteredEnquiries"
            :date-key="'updatedAt'"
            :user-id="user?.id"
            :view-options="viewOptions"
            persistence-key="dashboard-enquiries"
            @update:filtered="sortedAndFilteredEnquiries = $event"
          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>
    <template #body>
      <UPageList
        ref="pageTop"
        :class="['gap-4', view === 'grid' && (loading || sortedAndFilteredEnquiries.length > 0) ? (sortOrder === 'listing' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 uw-grid' : 'grid grid-cols-1 xl:grid-cols-2') : '']"
      >
        <template v-if="loading">
          <OrganismsDashboardEnquiryCardSkeleton :cards="3" :view="view" />
        </template>
        <template v-else-if="sortedAndFilteredEnquiries.length > 0 && sortOrder !== 'listing'">
          <OrganismsDashboardEnquiryCard v-for="enquiry in sortedAndFilteredEnquiries" :key="enquiry.id" :enquiry="enquiry" :user="user" :view="view" @click="handleOpenModal(enquiry)" @reply="handleOpenModal" />
        </template>
        <template v-else-if="sortedAndFilteredEnquiries.length > 0 && sortOrder === 'listing'">
          <OrganismsDashboardEnquiryGroup v-for="group in groupedByListing" :key="group.listing?.id ?? 'general'" :group="group" :user="user" @click="openListingDetail" />
        </template>
        <OrganismsDashboardNoResults v-else :description="'No Enquiries found.'" />
      </UPageList>

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>

      <OrganismsDashboardEnquiryModal v-if="user" v-model:open="modalOpen" :conversation="activeEnquiry" :user="user" />
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
import type { ConversationWithMinimalListing } from "~~/shared/types/conversation";

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Your Enquiries",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});

const { enquiries, loading, fetchEnquiries, total, activeEnquiry, openEnquiry, closeEnquiry } = useEnquiries();
const { user } = useUserSession();
const router = useRouter();

const modalOpen = ref(false);
const filterRef = ref();
const page = ref(1);
const limit = ref(20);
const pageTop = ref<HTMLElement | null>(null);
const sortedAndFilteredEnquiries = ref<ConversationWithMinimalListing[]>([]);

const { activeView: view, activeTab: enquiryFilter, enquiriesFilter: directionFilter, sortOrderValue: sortOrder, viewOptions } = useDashboardListFilter(ref([]), { persistenceKey: "dashboard-enquiries" });

// Filtered enquiries come directly from API
const filteredEnquiries = computed(() => enquiries.value);

const groupedByListing = computed(() => {
  if (sortOrder.value !== "listing") return [];

  const groups = new Map<number | string, { listing: any; conversations: ConversationWithMinimalListing[] }>();

  sortedAndFilteredEnquiries.value.forEach((c) => {
    const listing = c.listing;
    const key = listing?.id ?? "general";

    if (!groups.has(key)) {
      groups.set(key, { listing, conversations: [] });
    }
    groups.get(key)!.conversations.push(c);
  });

  return Array.from(groups.values());
});

// Watch filter changes and re-fetch from API (reset to page 1)
watch(
  [enquiryFilter, directionFilter, sortOrder],
  async () => {
    page.value = 1;
    await fetchEnquiries({
      filter: enquiryFilter.value as any,
      direction: directionFilter.value as any,
      page: 1,
      sort: sortOrder.value as any,
      limit: limit.value,
    });
  }
);

// Initial fetch on component mount (not in watch immediate)
onMounted(async () => {
  await fetchEnquiries({
    filter: enquiryFilter.value as any,
    direction: directionFilter.value as any,
    page: 1,
    sort: sortOrder.value as any,
    limit: limit.value,
  })
});

// Handle page changes from pagination component
async function onPageChange(newPage: number) {
  page.value = newPage;

  await fetchEnquiries({
    filter: enquiryFilter.value as any,
    direction: directionFilter.value as any,
    page: newPage,
    sort: sortOrder.value as any,
    limit: limit.value,
  });

  const el = (pageTop.value as any)?.$el ?? pageTop.value;
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto");
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Open Enquiry Modal
 */
function handleOpenModal(enquiry: ConversationWithMinimalListing) {
  if (!enquiry?.id) return;
  openEnquiry(enquiry);
  modalOpen.value = true;
  filterRef.value?.close();
}

// Close modal and clear active enquiry
watch(modalOpen, (isOpen) => {
  if (!isOpen) {
    closeEnquiry();
  }
});

function openListingDetail(listingId?: number) {
  if (listingId) {
    router.push(`/dashboard/enquiries/${listingId}`);
  }
}
</script>
