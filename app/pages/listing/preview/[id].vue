<template>
  <ViewsListingDetail :listing="draftListing" :is-draft="true" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'draft-owner'
});

const route = useRoute();

/**
 *  Fetch and validate draft listing
 */
async function fetchDraftListing(id: string) {
  try {
    const draft = await useRequestFetch()<DraftListingWithFullPayload>(`/api/draft-listings/${id}`);
    if (!draft) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Draft listing not found'
      });
    }
    return draft;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 404,
      statusMessage: 'Draft listing not found'
    });
  }
}

const draftListing = await fetchDraftListing(route.params?.id as string);
</script>
