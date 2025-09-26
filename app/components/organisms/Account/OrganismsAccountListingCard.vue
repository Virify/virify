<template>
  <div class="account-card">
    <div class="account-card__header">
      <AtomsCollapsibleHeader 
        :is-collapsed="isCollapsed" 
        :title="title" 
        :icon="icon" 
        variant="inline" 
        @toggle="$emit('toggle')"
      />
    </div>

    <Transition name="collapse-fade">
      <div v-show="!isCollapsed" class="account-card__content">
        <div class="account-card__scrollable">
          <ul v-if="hasItems" class="account-card__list">
            <li v-for="item in items" :key="item.id" class="account-card__item">
              <NuxtLink :to="getListingUrl(item)" class="account-card__link">
                <div class="account-card__card">
                  <div class="account-card__main-row">
                    <AtomsAccountListingCardImage :image-src="getFirstImage(item)" :has-note="!!item.note" />

                    <div class="account-card__content-wrapper">
                      <MoleculesAccountListingCardDetails
                        :price="item.listing?.price"
                        :price-type="getPriceType(item)"
                        :address="item.listing?.property?.address"
                        :bedrooms="item.listing?.property?.numberBedrooms"
                        :bathrooms="item.listing?.property?.numberBathrooms"
                        :is-rental="isRental(item)"
                      >
                        <template #after-pill>
                          <AtomsNoteButton v-if="showNotesIcon" 
                            :listing-id="item.listing?.id!" 
                            class="account-card__note-btn" 
                            @click.prevent 
                          />
                          <AtomsFavouriteButton v-if="showFavouriteIcon" 
                            :is-favourite="item.isFavourite" 
                            :listing-id="item.listing?.id!" 
                            @click.prevent class="account-card__fav" 
                          />
                        </template>
                      </MoleculesAccountListingCardDetails>
                    </div>
                  </div>
                  <!-- notes text (no icon now) -->
                  <div class="account-card__notes" v-if="item.note" @click.prevent>
                    <p class="body-sm lineheight-sm">
                      <em class="font-bold">Notes: </em>
                      {{ item.note }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </li>
          </ul>

          <div v-else class="account-card__empty | body-sm">
            {{ emptyMessage }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">

interface Props {
  isCollapsed: boolean;
  title: string;
  icon: string;
  items?: RecentItem[];
  emptyMessage: string;
  showFavouriteIcon?: boolean;
  showNotesIcon?: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  toggle: [];
}>();

// Computed properties
const hasItems = computed(() => !!props.items?.length);

// Helper functions for data extraction
const getListingUrl = (item: RecentItem): string => `/listing/${item.listing?.id}`;

const getFirstImage = (item: RecentItem): string | null => {
  const media = item.listing?.property?.media;
  if (!Array.isArray(media)) return null;
  return media.find((m) => m.image)?.image || null;
};

const isRental = (item: RecentItem): boolean => !!item.listing?.rentalListing;

const getPriceType = (item: RecentItem): string | undefined => {
  return item.listing?.saleListing?.priceType ? item.listing.saleListing.priceType : item.listing?.rentalListing?.rentFrequency;
};

</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.account-card {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    background: var(--background-200);
    z-index: 1;
    padding: var(--size-16);
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  &__scrollable {
    flex: 1;
    overflow-y: auto;
    padding: var(--size-16) var(--size-16) var(--size-16);
    padding-top: 0;
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-12);
    margin: 0;
    padding: 0;
    list-style: none;
    align-items: stretch;

    @include mq.mobile-only {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__link {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  &__card {
    margin: 0;
    overflow: hidden;
    background: var(--background-100);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-500);
    transition: all 0.2s ease;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
      transform: translateY(1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--border-300);
    }
  }

  &__fav {
    background: inherit;
    border: none;
    padding: 0;
  }

  &__notes {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--size-8);
    padding: var(--size-8) var(--size-12);
    border-top: 1px solid var(--monochrome-500);
    background: inherit;
    flex-grow: 1;

    p {
      margin: 0;
    }
  }

  &__note-btn {
    background: inherit;
    border: none;
    padding: 0;
  }

  &__main-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start; /* image height fixed; content can be taller */
    gap: var(--size-12);
    width: 100%;
    box-sizing: border-box;
    flex: 1;

    @include mq.mobile-only {
      flex-direction: column;
      gap: var(--size-8);
      width: 100%;
    }
  }

  &__content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--size-8);
    color: var(--foreground-100);
    min-width: 0;
    position: relative;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    height: 100%;
    flex-grow: 1;

    @include mq.mobile-only {
      gap: var(--size-4);
      align-items: stretch;
      padding: var(--size-8) var(--size-8) var(--size-12);
    }
  }

  &__empty {
    color: var(--text-muted);
    padding: 1rem 0;
  }
}

.collapse-fade-enter-active,
.collapse-fade-leave-active {
  transition:
    max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s;
  overflow: hidden;
}

.collapse-fade-enter-from,
.collapse-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-fade-enter-to,
.collapse-fade-leave-from {
  max-height: 2000px;
  opacity: 1;
}
</style>
