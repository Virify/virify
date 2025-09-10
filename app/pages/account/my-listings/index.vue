<template>
  <div class="my-listings-page">
    <!-- Analytics/CTA band -->
    <OrganismsAccountCreateListingHero />

    <div class="my-listings-page__header">
      <h2 class="my-listings-page__title | title-md">My Listings</h2>
      <div class="my-listings-page__controls">
        <div class="my-listings-page__search-filter-row">
          <AtomsInput v-model="searchTerm" type="text" placeholder="Search my listings..." autocomplete="off"
            class="body-sm" />
          <AtomsSelect v-model="sortOrStatus" :options="combinedOptions"
            class="my-listings-page__filter-select | body-sm" />
        </div>
      </div>
    </div>

    <div class="my-listings-page__grid">
      <div class="my-listings-page__card">
        <div v-if="(listings?.length || 0) > 0" class="my-listings-page__list">
          <div v-for="listing in listings" :key="listing.id" class="my-listings-page__item">
            <OrganismsAccountOwnListingCard :item="listing" @edit="onEdit" />
          </div>
          <div class="my-listings-page__load-more" v-if="hasMore">
            <AtomsButton class="button button-sm button-secondary" :disabled="loading" @click="loadMore">{{ loading ?
              'Loading…' : 'Load more' }}</AtomsButton>
          </div>
        </div>
        <div v-else class="my-listings-page__empty | body-sm">You have no listings yet.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["authenticated"], layout: "account" });

const seoData = { 
  title: "My Listings - Virify", 
  description: "Manage your listings, publish status and view analytics." 
}
useSeoMeta(seoData)

const { listings, hasMore, loadMore, loading, searchTerm, statusFilter, sortBy } = useMyListings()

const combinedOptions = [
  { key: 'All', value: 'all' },
  { key: 'Premium', value: 'premium' },
  { key: 'Featured', value: 'featured' },
  { key: 'Basic', value: 'basic' },
  { key: 'Newest', value: 'new' },
  { key: 'Oldest', value: 'old' },
  { key: 'Active', value: 'active' },
  { key: 'Inactive', value: 'inactive' },
  { key: 'Draft', value: 'draft' },
]

const sortOptions = ['new', 'old', 'premium', 'featured', 'basic'] as const
const statusOptions = ['all', 'active', 'inactive', 'draft'] as const

const sortOrStatus = computed({
  get: () => statusFilter.value !== 'all' ? statusFilter.value : sortBy.value,
  set: (val: string) => {
    if (sortOptions.includes(val as any)) {
      sortBy.value = val as any
      statusFilter.value = 'all'
    } else {
      statusFilter.value = val as any
    }
  }
})

function onEdit(id: number) {
  useToast().showToast('Edit not implemented yet', { type: 'info' })
}
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.my-listings-page {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  min-width: 0;
  width: 100%;

  &__analytics {
    margin-bottom: var(--size-8);
  }

  &__analytics-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-12);
    align-items: stretch;

    > * {
      flex: 1 1 calc(33.333% - var(--size-12));
      min-width: 260px;
    }
  }

  &__cta-link .button {
    color: var(--monochrome-900);
  }

  &__header {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    padding: var(--size-24);
  }

  &__title {
    margin: 0 0 var(--size-16) 0;
  }

  &__controls {
    width: 100%;
  }

  &__search-filter-row {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: var(--size-12);
    align-items: center;

    @include mq.tablet {
      grid-template-columns: 2fr 1fr;
    }

    @include mq.mobile-only {
      grid-template-columns: 1fr;
      gap: var(--size-8);
    }
  }

  &__filter-select {
    min-width: 160px;
    padding: var(--size-8) var(--size-12);

    @include mq.mobile-only {
      width: 100%;
      min-width: unset;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-16);
    overflow: visible;
  }

  &__card {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--size-16);
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-12);
    width: 100%;
  }

  &__item {
    display: flex;
    width: 100%;
  }

  &__load-more {
    display: flex;
    justify-content: center;
    padding: var(--size-8);
  }

  &__empty {
    color: var(--text-muted);
    padding: var(--size-12);
  }
}
</style>