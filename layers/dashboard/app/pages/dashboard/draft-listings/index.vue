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
          <OrganismsDashboardFilterListings
            :items="pageDrafts"
            persistence-key="dashboard-draft-listings"
            :hide-sale-rent-filter="true"
            :show-admin-owner-filter="isAdmin"
          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Tier Selection Table -->
      <MoleculesDashboardPriceTier
        v-if="!pageDrafts.length && !loading"
        @select-tier="handleCreateListing"
      />

      <!-- Loading State -->
      <OrganismsDashboardListingCardGrid
        ref="pageTop"
        v-if="loading"
      >
        <OrganismsDashboardListingCardMyListingSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>

      <!-- Draft Listings Grid -->
      <OrganismsDashboardListingCardGrid
        ref="pageTop"
        v-else-if="filteredDrafts.length > 0"
      >
        <div
          v-for="draft in filteredDrafts"
          :key="draft.id"
          class="h-full"
        >
          <OrganismsDashboardListingCardMyListing
            :listing="draft"
            @edit="handleEditDraft"
            @published="handlePublished"
            @deleted="handleDeleted"
          />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults
        v-else
        type="draft listings"
      />

      <!-- Pagination -->
      <div
        v-if="pageTotal > 0"
        class="flex justify-center p-4 mt-auto"
      >
        <UPagination
          v-model:page="page"
          @update:page="onPageChange"
          :total="pageTotal"
          :items-per-page="limit"
          variant="ghost"
          active-color="secondary"
          color="secondary"
          size="md"
          class="body-sm"
        />
      </div>

      <!-- Shared Listing Editor Modal -->
      <LazyOrganismsDashboardCreateListingModal
        ref="listingModal"
        @close="handleModalClose"
      />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
  import type { ListingTier } from "~~/layers/database/server/database/prisma/generated/enums";
  definePageMeta({
    middleware: ["authenticated"],
    head: {
      title: "Draft Listings",
      icon: "i-lucide-file-text",
    },
    layout: "dashboard",
  });

  const { user } = useUserSession();
  const { isAdmin } = useRole();
  const { draftListings, total: sharedTotal } = useDraftListings();
  const requestFetch = useRequestFetch();

  const pageTop = ref<HTMLElement | null>(null);
  const page = ref(1);
  const limit = 20;

  const listingModal = ref<{
    openForNewListing: (tier: any) => void;
    openForDraft: (id: number) => Promise<void>;
    openForListing: (id: number) => Promise<void>;
  } | null>(null);

  const { sortOrderValue, searchQuery, ownerFilter } = useDashboardListFilter(ref([]), {
    persistenceKey: "dashboard-draft-listings",
    hideListingSort: true,
    adminOwnerFilter: isAdmin.value,
  });

  const mapSortOrder = computed(() =>
    sortOrderValue.value === "newest" ? "new" : "old",
  );

  // Reset to page 1 when sort changes
  watch([mapSortOrder, ownerFilter], () => {
    page.value = 1;
  });

  // Return data so it's serialized in SSR payload and available during hydration
  const {
    data: fetchedData,
    pending: loading,
    refresh,
  } = useAsyncData(
    () =>
      `draft-listings:${user.value?.id}:${mapSortOrder.value}:${ownerFilter.value}:${page.value}`,
    () =>
      requestFetch<{ drafts: DraftListingWithFullPayload[]; total: number }>(
        `/api/user/draft-listings/?sort=${mapSortOrder.value}&page=${page.value}&take=${limit}&owner=${ownerFilter.value}`,
      ),
    { server: true },
  );

  // SSR-safe derived data (serialized in Nuxt payload, available immediately on hydration)
  const pageDrafts = computed(() =>
    (fetchedData.value?.drafts ?? []).map(
      (draft): DraftListingForCard => ({
        ...draft,
        analytics: { viewsCount: 0, favouritesCount: 0, enquiriesCount: 0 },
        published: false,
        archived: false,
        isDraft: true,
        draftId: draft.id,
        publishedAt: null,
      }),
    ),
  );
  const pageTotal = computed(() => fetchedData.value?.total ?? 0);

  // Sync to shared composable for external consumers
  watch(
    pageDrafts,
    (items) => {
      draftListings.value = items;
    },
    { immediate: true },
  );
  watch(
    pageTotal,
    (t) => {
      sharedTotal.value = t;
    },
    { immediate: true },
  );

  // Client-side search filter derived from SSR-safe data
  const filteredDrafts = computed(() => {
    if (!searchQuery.value) return pageDrafts.value;
    const term = searchQuery.value.toLowerCase();
    return pageDrafts.value.filter(
      (draft) =>
        draft.property?.address?.fullAddress?.toLowerCase().includes(term) ||
        draft.price?.toString().includes(term),
    );
  });

  function handleCreateListing(tier: ListingTier) {
    listingModal.value?.openForNewListing(tier);
  }

  async function onPageChange(newPage: number) {
    page.value = newPage;
    const el = (pageTop.value as any)?.$el ?? pageTop.value;
    const scrollContainer = el?.closest(
      ".overflow-y-auto, .overflow-y-scroll, .overflow-auto",
    );
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleEditDraft(payload: { id: number; isDraft: boolean }) {
    await listingModal.value?.openForDraft(payload.id);
  }

  function handleModalClose() {
    refresh();
  }

  function handleDeleted(draftId: number) {
    if (!fetchedData.value) return;
    fetchedData.value = {
      drafts: fetchedData.value.drafts.filter((d) => d.id !== draftId),
      total: Math.max(0, fetchedData.value.total - 1),
    };
  }

  function handlePublished() {
    refresh();
    navigateTo("/dashboard/my-listings");
  }
</script>
