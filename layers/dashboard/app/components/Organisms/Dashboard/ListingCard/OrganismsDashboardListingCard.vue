<template>
  <div class="relative h-full">
    <!-- Removed overlay -->
    <Transition name="fade">
      <div v-if="isPending || isNoteRemovalPending"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-elevated/70 rounded-lg">
        <UIcon :name="isNoteRemovalPending ? 'i-lucide-notebook-pen' : 'i-lucide-heart-off'"
          class="w-8 h-8 text-muted-foreground mb-2" />
        <span class="text-muted-foreground body-md">Removed</span>
      </div>
    </Transition>

    <UPageCard variant="naked" reverse
      class="p-4 border border-accented/50 bg-elevated/30 rounded-lg h-full flex flex-col transition-all duration-300"
      :class="{
        'opacity-40 blur-xs pointer-events-none': isPending || isNoteRemovalPending,
      }" :ui="{
        header: 'mb-0 w-full',
        title: 'my-1',
        description: 'text-(--foreground-100) w-full flex-1 flex flex-col justify-between',
        footer: 'mt-1 pt-0 w-full',
        body: 'w-full flex flex-col flex-1',
      }">
      <AtomsCloudFlareImage v-if="getMainImage(listing?.property)" :src="getMainImage(listing?.property)!"
        alt="Listing image" variant="gallery" :placeholder="true"
        class="w-full h-54 object-bottom object-cover rounded-lg aspect-4/3 relative" />
        <!-- viewing badge -->
        <UBadge
          v-if="viewingBadgeLabel"
          :label="viewingBadgeLabel"
          icon="i-lucide-calendar"
          size="lg"
          color="secondary"
          variant="solid"
          class="mb-1 absolute top-2 right-2 z-1 text-xs"
        />
        <!-- price reduced interactive badge -->
        <PropertyCardHistory
          v-if="listing.ListingPriceHistory?.length"
          :historic="listing.ListingPriceHistory"
          :current="listing.price ?? undefined"
          :inline="true"
          class="absolute top-2 left-2 z-1"
        />

      <template #header>
        <div class="flex flex-row justify-between">
          <div class="flex justify-between items-start">
            <p class="body-sm">
              <span class="font-bold body-md">
                {{ formatCurrency(listing.price) }}
              </span>

              / {{ convertEnumToCapalizedString(listing.saleListing?.priceType || listing.rentalListing?.rentFrequency
              || "") }}
            </p>
          </div>
          <UBadge size="md" color="secondary" class="mx-1" variant="subtle">
            {{ listing.rentalListing ? "For Rent" : "For Sale" }}
          </UBadge>
        </div>
      </template>

      <template #title>
        <p class="body-sm">{{ formattedAddress(listing?.property?.address) }}</p>
      </template>

      <template #description>
        <div class="flex flex-row flex-wrap gap-1">
          <UBadge icon="i-lucide-bed-double" size="md" color="secondary" variant="subtle"> {{
            listing?.property?.numberBedrooms }} bed </UBadge>
          <UBadge icon="i-lucide-bath" size="md" color="secondary" variant="subtle"> {{
            listing?.property?.numberBathrooms }} bathroom </UBadge>
          <UBadge v-if="listing?.property?.outdoorSpace?.garden.length" icon="i-lucide-fence" size="md"
            color="secondary" variant="subtle"> {{ listing?.property?.outdoorSpace?.garden.length }} garden </UBadge>
        </div>
        <div v-if="note.note"
          class="my-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-start gap-1 group"
          @click="showNoteDialog(listing?.id!)">
          <UIcon name="i-lucide-notebook-pen" class="w-3.5 h-3.5 mt-0.5 shrink-0 group-hover:text-primary" />
          <span class="leading-snug line-clamp-2">{{ note.note }}</span>
        </div>
        <div v-else class="my-2">
          <button class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            @click="showNoteDialog(listing?.id!)">
            <UIcon name="i-lucide-plus-circle" class="w-3.5 h-3.5 mt-0.5" />
            Add Note
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2 items-center">
          <UButton variant="solid" size="md" color="secondary" block class="text-white! font-bold"
            :to="`/listing/${listing?.id}`"> View </UButton>
          <UButton variant="soft" size="md" color="secondary" block class="font-bold" :to="`/listing/${listing?.id}`">
            Enquire </UButton>
        </div>
      </template>

      <template #footer>
        <USeparator class="my-3" />
        <div class="flex justify-between items-center w-full">
          <p v-if="showFavDate" class="body-xs">
            Favourite added on:
            {{
              new Date(showFavDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            }}
          </p>
          <p v-if="showNotesDate" class="body-xs">
            Note updated on:
            {{
              new Date(showNotesDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            }}
          </p>
          <p v-if="showViewedDate" class="body-xs">
            Viewed on:
            {{
              new Date(showViewedDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            }}
          </p>
          <div class="flex gap-2 items-center ml-auto">
            <UIcon name="i-lucide-share-2"
              class="w-5 h-5 m-0 p-0 cursor-pointer text-muted-foreground hover:text-foreground" />
            <AtomsNoteButton :listing-id="listing?.id!" icon-class="w-5 h-5" />
            <AtomsFavouriteButton :listing-id="listing?.id!" icon-class="w-5 h-5" :confirm-removal="true" />
          </div>
        </div>
      </template>
    </UPageCard>
  </div>
</template>
<script lang="ts" setup>
import { ViewsDialogConfirmRemoveFavourite } from "#components";

const { isPendingRemoval } = useFavourites();
const { getNoteData, showNoteDialog, isNotePendingRemoval } = useNotes();
const { showDialog } = useDialog();

interface Props {
  listing: ListingCardType;
  fav?: string | Date;
  note?: string | Date;
  viewed?: string | Date;
}
const props = defineProps<Props>();

const { getActiveViewingForListing, getViewingStatusLabel } = useViewings();

const viewingBadgeLabel = computed(() => {
  const v = getActiveViewingForListing(props.listing?.id!);
  return v ? getViewingStatusLabel(v) : null;
});

/**
 * Check if this card is pending removal.
 * Only show the overlay when this card is being used as a favourite card (props.fav set).
 * On the notes page (no fav prop), we never show this overlay — the pending state
 * is for the favourites page context only.
 */
const isPending = computed(() => {
  return !!props.fav && isPendingRemoval(props.listing?.id!);
});

/**
 * Check if the note on this card is pending removal.
 * Only show the overlay when this card is being used as a note card (props.note set).
 */
const isNoteRemovalPending = computed(() => {
  return !!props.note && isNotePendingRemoval(props.listing?.id!);
});

/**
 * Get Note Data
 */
const note = computed(() => {
  return getNoteData(props.listing?.id!);
});

/**
 * Show Favourite Date
 */
const showFavDate = computed(() => {
  return props.fav as Date;
});

/**
 * Show Notes Date
 */
const showNotesDate = computed(() => {
  return props.note as Date;
});

/**
 * Show Viewed Date
 */
const showViewedDate = computed(() => {
  return props.viewed as Date;
});

/**
 * Format Address
 * @param address String
 */
const formattedAddress = (address: any): string => {
  if (!address) return "";
  return address.street + ", " + address.city + ", " + address.postcode.split(" ")[0];
};
</script>
