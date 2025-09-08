<template>
  <div class="recent-card">
    <div class="recent-card__header">
      <AtomsCollapsibleHeader :is-collapsed="isCollapsed" :title="title" :icon="icon" variant="inline"
        @toggle="$emit('toggle')" />
    </div>

    <Transition name="collapse-fade">
      <div v-show="!isCollapsed" class="recent-card__content">
        <div class="recent-card__scrollable">

          <ul v-if="hasItems" class="recent-card__list">
            <li v-for="item in items" :key="item.id" class="recent-card__item">

              <NuxtLink :to="getListingUrl(item)" class="recent-card__link">
                <div class="recent-card__card">
                  <div class="recent-card__main-row">
                    <AtomsAccountRecentCardImage :image-src="getFirstImage(item)" />

                    <div class="recent-card__content-wrapper">
                      <MoleculesAccountRecentCardDetails :price="item.listing?.price"
                        :address="item.listing?.property?.address" :bedrooms="item.listing?.property?.numberBedrooms"
                        :bathrooms="item.listing?.property?.numberBathrooms" :note="item.note"
                        :is-rental="isRental(item)" />

                      <MoleculesAccountRecentCardIcons :is-favourite="item.isFavourite"
                        :show-favourite-icon="showFavouriteIcon" :show-notes-icon="showNotesIcon"
                        @toggle-favourite="toggleFavourite(item)" @edit-note="editNote(item)" />
                    </div>
                  </div>
                </div>
              </NuxtLink>
              
            </li>
          </ul>

          <div v-else class="recent-card__empty | body-sm">
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

const { toggleFavourite: toggleFavouriteAction } = useFavourites();
const { showNoteDialog } = useNotes();

// Computed properties
const hasItems = computed(() => !!props.items?.length);

// Action handlers
const toggleFavourite = async (item: RecentItem) => {
  if (item.listing?.id) {
    await toggleFavouriteAction(item.listing.id);
  }
};

const editNote = (item: RecentItem) => {
  if (item.listing?.id) {
    showNoteDialog(item.listing.id);
  }
};

// Helper functions for data extraction
const getListingUrl = (item: RecentItem): string => `/listing/${item.listing?.id}`;

const getFirstImage = (item: RecentItem): string | null => {
  const media = item.listing?.property?.media;
  if (!Array.isArray(media)) return null;
  return media.find((m) => m.image)?.image || null;
};

const isRental = (item: RecentItem): boolean => !!item.listing?.rentalListing;
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.recent-card {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    background: var(--background-200);
    z-index: 1;
    padding: var(--size-16) var(--size-16) 0;
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
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-12);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 300px;
  }

  &__link {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
  }

  &__card {
    margin: 0;
    overflow: hidden;
    background: var(--background-200);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-500);
    transition: all 0.2s ease;
    flex: 1;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--border-300);
    }
  }

  &__main-row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: var(--size-12);
    flex: 1;
    min-height: 100px;

    @include mq.mobile-only {
      gap: var(--size-8);
      min-height: 80px;
    }
  }

  &__content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    padding: var(--size-8);
    color: var(--foreground-100);
    min-width: 0;
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
