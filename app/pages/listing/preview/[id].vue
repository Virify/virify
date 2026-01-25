<template>
  <div>
    <!-- Preview Banner -->
    <div class="preview-banner">
      <div class="container preview-banner__content">
        <NuxtLink to="/dashboard/draft-listings/" class="preview-banner__back | body-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Editing
        </NuxtLink>
        <div class="preview-banner__badge | body-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview Mode
        </div>
      </div>
    </div>
    
    <OrganismsListingDetail :listing="draftListing" :is-draft="true" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'draft-owner'
});

const route = useRoute();

/**
 *  Fetch and validate draft listing - reactive to route changes
 */
const { data: draftListingData, error } = await useAsyncData(
  `draft-listing-${route.params.id}`,
  async () => {
    const draft = await useRequestFetch()<DraftListingWithFullPayload>(`/api/draft-listings/${route.params.id}`);
    if (!draft) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Draft listing not found'
      });
    }
    return draft;
  },
  {
    watch: [() => route.params.id]
  }
);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Draft listing not found',
    fatal: true
  });
}

const draftListing = computed(() => draftListingData.value);
</script>

<style scoped lang="scss">
@use "#styles/_utils/media" as mq;
.preview-banner {
  position: sticky;
  top: 0;
  z-index: 12;
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  padding: var(--size-16) 0;
  box-shadow: 0 var(--size-2) var(--size-4) rgba(0, 0, 0, 0.1);

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-4);
  }

  &__back {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    color: white;
    text-decoration: none;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }

    svg {
      flex-shrink: 0;
    }
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    color: var(--monochrome-900);
    background: rgba(255, 255, 255, 0.2);
    padding: var(--size-8);
    border-radius: var(--size-8);
    backdrop-filter: blur(10px);

    svg {
      flex-shrink: 0;
    }
  }
}
</style>
