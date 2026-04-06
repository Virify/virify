<template>
  <UPageCard
    variant="naked"
    reverse
    class="p-4 border border-accented/50 bg-elevated/30 rounded-lg h-full flex flex-col transition-all duration-300"
    :class="{ 'opacity-60': listing.archived }"
    :ui="{
      header: 'mb-0 w-full',
      title: 'my-1',
      description: 'text-(--foreground-100) w-full flex-1 flex flex-col justify-between',
      footer: 'mt-1 pt-0 w-full',
      body: 'w-full flex flex-col flex-1',
    }"
  >
    <!-- Image with placeholder for drafts without images -->
    <AtomsCloudFlareImage 
      v-if="hasImage" 
      :src="getMainImage(listing?.property)!" 
      alt="Listing image" 
      variant="gallery" 
      :placeholder="true" 
      class="w-full h-54 object-cover rounded-lg aspect-4/3" 
    />
    <div 
      v-else 
      class="w-full h-54 bg-elevated/50 rounded-lg aspect-4/3 flex items-center justify-center border border-dashed border-accented/30"
    >
      <div class="flex flex-col items-center gap-2 text-muted-foreground">
        <UIcon name="i-lucide-image-off" class="w-8 h-8" />
        <span class="body-xs">No images yet</span>
      </div>
    </div>

    <template #header>
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <p class="body-md m-0">
            <span v-if="hasPrice" class="font-bold body-md">{{ formatCurrency(listing.price!) }}</span>
            <span v-else class="font-medium body-md text-muted-foreground italic">No price set</span>
            <span v-if="priceType && hasPrice" class="text-muted-foreground"> / {{ priceType }}</span>
          </p>
          <UBadge v-if="listing.isDraft" size="md" color="error" variant="subtle">Draft</UBadge>
          <UBadge v-else-if="listing.archived" size="md" color="secondary" variant="subtle">Archived</UBadge>
          <UBadge v-if="hasListingType" size="md" color="secondary" variant="subtle">{{ listing.rentalListing ? "For Rent" : "For Sale" }}</UBadge>
          <UBadge v-if="tierBadge" size="md" color="secondary" variant="outline">{{ tierBadge }}</UBadge>
        </div>
      </div>
    </template>

    <template #description>
      <div class="flex flex-col gap-3 h-full">
        <!-- Address with placeholder -->
        <p v-if="hasAddress" class="body-sm text-foreground mt-1!">{{ formattedAddress }}</p>
        <p v-else class="body-sm text-muted-foreground italic mt-1!">Address not set</p>
        
        <!-- Room features with placeholders -->
        <div class="flex flex-row flex-wrap gap-1">
          <UBadge v-if="hasBedrooms" icon="i-lucide-bed-double" size="md" color="secondary" variant="subtle">{{ listing?.property?.numberBedrooms }} bed</UBadge>
          <UBadge v-else-if="listing.isDraft" icon="i-lucide-bed-double" size="md" color="secondary" variant="outline">- bed</UBadge>
          
          <UBadge v-if="hasBathrooms" icon="i-lucide-bath" size="md" color="secondary" variant="subtle">{{ listing?.property?.numberBathrooms }} bath</UBadge>
          <UBadge v-else-if="listing.isDraft" icon="i-lucide-bath" size="md" color="secondary" variant="outline">- bath</UBadge>
          
          <UBadge v-if="listing?.property?.outdoorSpace?.garden?.length" icon="i-lucide-fence" size="md" color="secondary" variant="subtle">{{ listing?.property?.outdoorSpace?.garden.length }} garden</UBadge>
        </div>
        
        <!-- Analytics (only show for non-drafts or drafts with some activity) -->
        <div v-if="!listing.isDraft || hasAnalytics" class="flex items-center gap-2 flex-wrap">
          <UBadge icon="i-lucide-eye" size="md" color="primary" variant="solid" :title="`${listing.analytics.viewsCount} views`">{{ listing.analytics.viewsCount }}</UBadge>
          <UBadge icon="i-lucide-heart" size="md" color="primary" variant="solid" :title="`${listing.analytics.favouritesCount} favourites`">{{ listing.analytics.favouritesCount }}</UBadge>
          <UBadge icon="i-lucide-mail" size="md" color="primary" variant="solid" :title="`${listing.analytics.enquiriesCount} enquiries`">{{ listing.analytics.enquiriesCount }}</UBadge>
        </div>
        
        <!-- Draft progress indicator -->
        <div v-if="listing.isDraft" class="flex items-center gap-2">
          <UBadge 
            v-if="isAllStepsCompleted" 
            icon="i-lucide-check-circle" 
            size="md" 
            color="success" 
            variant="outline"
          >Ready to Publish</UBadge>
          <UBadge 
            v-else 
            icon="i-lucide-construction" 
            size="md" 
            color="error" 
            variant="outline"
          >{{ completedStepsCount }}/9 Steps</UBadge>
        </div>
        
        <!-- Publish toggle + availability status (only for completed non-archived listings) -->
        <div v-if="canTogglePublish" class="flex items-center gap-3">
          <USwitch
            v-model="isPublished"
            :disabled="isUpdating"
            label="Published"
            size="md"
            color="secondary"
            @update:model-value="handleTogglePublish"
            :ui="{
              base: 'p-0! w-8.5 border! border-accented! data-[state=unchecked]:bg-black/20',
              label: 'text-xs',
              thumb: 'w-5 h-5 border border-accented bg-white!',
            }"
          />
          <USelect
            v-if="availabilityItems.length > 0"
            v-model="currentAvailabilityStatus"
            :items="availabilityItems"
            :disabled="isUpdatingStatus"
            size="xs"
            color="secondary"
            class="w-40"
            @update:model-value="handleAvailabilityChange"
          />
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap gap-2 mt-auto pt-2">
          <!-- Archived: single restore action -->
          <template v-if="listing.archived">
            <UButton
              variant="solid"
              size="xs"
              color="secondary"
              class="font-semibold flex-1 justify-center text-white!"
              icon="i-lucide-undo-2"
              label="Restore"
              :disabled="isRestoring"
              :loading="isRestoring"
              @click="openRestoreDialog"
            />
          </template>

          <!-- Non-archived -->
          <template v-else>
            <UButton 
              variant="subtle" 
              size="xs" 
              color="secondary" 
              class="font-semibold flex-1 justify-center" 
              icon="i-lucide-pencil" 
              :label="listing.isDraft ? 'Continue' : 'Edit'" 
              @click="handleEdit"
            />
            <UButton 
              variant="subtle" 
              size="xs" 
              color="secondary" 
              class="font-semibold flex-1 justify-center" 
              :to="viewUrl" 
              target="_blank" 
              icon="i-lucide-eye" 
              label="View" 
              :disabled="!canView" 
            />
            <UButton 
              v-if="listing.isDraft"
              variant="solid" 
              size="xs" 
              color="secondary" 
              class="font-semibold flex-1 justify-center text-white!" 
              icon="i-lucide-rocket"
              label="Publish"
              :disabled="!isAllStepsCompleted || isPublishing"
              :loading="isPublishing"
              @click="handlePublish"
            />
            <UButton 
              v-if="!listing.isDraft" 
              variant="subtle" 
              size="xs" 
              color="error" 
              class="font-semibold flex-1 justify-center cursor-pointer" 
              :disabled="isDeleting" 
              @click="openArchiveDialog" 
              icon="i-lucide-trash-2" 
              label="Delete" 
            />
            <UButton 
              v-else 
              variant="subtle" 
              size="xs" 
              color="error" 
              class="font-semibold flex-1 justify-center cursor-pointer" 
              :disabled="isDeleting" 
              @click="openDiscardDialog" 
              icon="i-lucide-trash-2" 
              label="Discard" 
            />
          </template>
        </div>
      </div>
    </template>

    <template #footer>
      <USeparator class="my-3" />
      <div class="flex justify-between items-center w-full">
        <p class="body-xs text-muted-foreground">{{ dateLabel }}</p>
        <div class="flex gap-2 items-center ml-auto">
          <UIcon name="i-lucide-share-2" class="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </template>

    <!-- Archive Listing Confirmation Dialog -->
    <OrganismsDashboardConfirmDialog
      ref="archiveDialog"
      title="Archive Listing"
      message="Are you sure you want to archive this listing? This will unpublish it and mark it as archived."
      confirm-label="Archive"
      type="danger"
      :loading="isDeleting"
      @confirm="handleArchiveConfirm"
    />

    <!-- Discard Draft Confirmation Dialog -->
    <OrganismsDashboardConfirmDialog
      ref="discardDialog"
      title="Discard Draft"
      message="Are you sure you want to discard this draft? This action cannot be undone."
      confirm-label="Discard"
      type="danger"
      :loading="isDeleting"
      @confirm="handleDiscardConfirm"
    />

    <!-- Restore Listing Confirmation Dialog -->
    <OrganismsDashboardConfirmDialog
      ref="restoreDialog"
      title="Restore Listing"
      message="This will restore the listing to My Listings as unpublished. You can then edit and re-publish it when ready."
      confirm-label="Restore"
      type="info"
      :loading="isRestoring"
      @confirm="handleRestoreConfirm"
    />
  </UPageCard>
</template>

<script setup lang="ts">
import type { DraftListingForCard } from '~~/layers/dashboard/app/composables/useDraftListings';
import OrganismsDashboardConfirmDialog from '~~/layers/dashboard/app/components/Organisms/Dashboard/OrganismsDashboardConfirmDialog.vue';

// Accept both OwnedListingWithAnalytics and DraftListingForCard
type ListingCardItem = OwnedListingWithAnalytics | DraftListingForCard;

interface Props {
  listing: ListingCardItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'edit': [payload: { id: number; isDraft: boolean }]
}>()

const { archiveListing, restoreListing, setPublished, setAvailabilityStatus } = useMyListings();
const toast = useToast();

// Dialog refs
const archiveDialog = ref<InstanceType<typeof OrganismsDashboardConfirmDialog> | null>(null);
const discardDialog = ref<InstanceType<typeof OrganismsDashboardConfirmDialog> | null>(null);
const restoreDialog = ref<InstanceType<typeof OrganismsDashboardConfirmDialog> | null>(null);

const isDeleting = ref(false);
const isUpdating = ref(false);
const isPublishing = ref(false);
const isUpdatingStatus = ref(false);
const isRestoring = ref(false);
const isPublished = ref(props.listing.published);

const currentAvailabilityStatus = ref<string>(
  props.listing.saleListing?.availabilityStatus ??
  props.listing.rentalListing?.availabilityStatus ??
  'AVAILABLE'
);

const availabilityItems = computed(() => {
  if (props.listing.saleListing) return saleAvailabilityItems;
  if (props.listing.rentalListing) return rentalAvailabilityItems;
  return [];
});

// Draft completion tracking
const completedStepsCount = computed(() => {
  if (!props.listing.isDraft) return 9;
  // completedSteps is an array of step numbers
  return (props.listing as any).completedSteps?.length ?? 0;
});

const isAllStepsCompleted = computed(() => completedStepsCount.value >= 9);

// Computed properties for checking if data exists
const hasImage = computed(() => !!getMainImage(props.listing?.property));
const hasPrice = computed(() => props.listing.price != null && props.listing.price > 0);
const hasAddress = computed(() => {
  const address = props.listing.property?.address;
  return !!(address?.street || address?.city || address?.postcode);
});
const hasBedrooms = computed(() => (props.listing?.property?.numberBedrooms ?? 0) > 0);
const hasBathrooms = computed(() => (props.listing?.property?.numberBathrooms ?? 0) > 0);
const hasListingType = computed(() => !!props.listing.rentalListing || !!props.listing.saleListing);
const hasAnalytics = computed(() => {
  const { viewsCount, favouritesCount, enquiriesCount } = props.listing.analytics;
  return viewsCount > 0 || favouritesCount > 0 || enquiriesCount > 0;
});

// Can view if: published, OR not a draft, OR draft with 3+ steps completed (for preview)
const canView = computed(() => {
  if (props.listing.published || !props.listing.isDraft) return true;
  // For drafts, allow preview after step 3 (pricing) is complete
  return completedStepsCount.value >= 3;
});

// View URL - drafts use preview route, live listings use normal route
const viewUrl = computed(() => {
  if (!canView.value) return undefined;
  if (props.listing.isDraft) {
    const draftId = (props.listing as any).draftId ?? props.listing.id;
    return `/listing/preview/${draftId}`;
  }
  return `/listing/${props.listing.id}`;
});

// Can only toggle publish / change status for non-draft, non-archived listings
const canTogglePublish = computed(() => !props.listing.isDraft && !props.listing.archived);

const formattedAddress = computed(() => {
  const address = props.listing.property?.address;
  if (!address) return "";
  return [address.street, address.city, address.postcode?.split(" ")[0]].filter(Boolean).join(", ");
});

const priceType = computed(() => {
  const type = props.listing.saleListing?.priceType || props.listing.rentalListing?.rentFrequency;
  return type ? convertEnumToCapalizedString(type) : "";
});

const tierBadge = computed(() => {
  const tier = String(props.listing.listingTier || "").toLowerCase();
  if (tier === "premium") return "Premium";
  if (tier === "featured") return "Featured";
  return null;
});

const dateLabel = computed(() => {
  // Use updatedAt for the footer date
  const date = (props.listing as any).updatedAt;
  if (!date) return "";
  
  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  
  return `Updated on: ${formatted}`;
});

/**
 * Handle edit button click.
 * Emits event to parent to open modal with listing data.
 * Works for both drafts and live listings.
 */
async function handleEdit() {
  if (props.listing.isDraft) {
    // For drafts, use draftId if available
    const draftId = props.listing.draftId ?? props.listing.id;
    emit('edit', { id: draftId, isDraft: true });
  } else {
    // For live listings, use the listing id
    emit('edit', { id: props.listing.id, isDraft: false });
  }
}

async function handlePublish() {
  if (!isAllStepsCompleted.value) return;
  
  isPublishing.value = true;
  try {
    const draftId = (props.listing as any).draftId ?? props.listing.id;
    await useRequestFetch()('/api/listing/publish/', {
      method: 'POST',
      body: { draftId }
    });
    toast.add({
      title: 'Success!',
      description: 'Your listing has been published',
      color: 'success',
    });
    // Refresh aggregates to update sidebar counts
    const { fetchUserItemsAggregates } = useNotifications();
    await fetchUserItemsAggregates(true);
    // Refresh the listings
    const { refetchCurrentPage } = useDraftListings();
    await refetchCurrentPage();
  } catch (error: any) {
    toast.add({
      title: 'Publish Failed',
      description: error?.data?.statusMessage || 'Failed to publish listing',
      color: 'error',
    });
  } finally {
    isPublishing.value = false;
  }
}

async function handleAvailabilityChange(value: string | number | boolean | null) {
  if (!value || typeof value !== 'string') return;
  isUpdatingStatus.value = true;
  const previous = currentAvailabilityStatus.value;
  try {
    await setAvailabilityStatus(props.listing.id, value as AvailabilityOptions);
    toast.add({
      title: 'Status updated',
      description: availabilityItems.value.find((i) => i.value === value)?.label ?? value,
      color: 'success',
    });
  } catch {
    currentAvailabilityStatus.value = previous;
    toast.add({ title: 'Error', description: 'Failed to update listing status', color: 'error' });
  } finally {
    isUpdatingStatus.value = false;
  }
}

async function handleTogglePublish(value: boolean) {
  isUpdating.value = true;
  try {
    await setPublished(props.listing.id, value);
    toast.add({
      title: "Success",
      description: value ? "Listing published" : "Listing unpublished",
      color: "success",
    });
  } catch (error) {
    isPublished.value = !value;
    toast.add({
      title: "Error",
      description: "Failed to update listing",
      color: "error",
    });
  } finally {
    isUpdating.value = false;
  }
}

// Open archive confirmation dialog
function openArchiveDialog() {
  archiveDialog.value?.open();
}

// Open discard confirmation dialog
function openDiscardDialog() {
  discardDialog.value?.open();
}

// Handle archive confirmation
async function handleArchiveConfirm() {
  isDeleting.value = true;
  try {
    await archiveListing(props.listing.id);
    archiveDialog.value?.close();
    // Refresh aggregates to update sidebar counts
    const { fetchUserItemsAggregates } = useNotifications();
    await fetchUserItemsAggregates(true);
    // Toast is shown by useMyListings.archiveListing
  } catch (error) {
    // Error toast is shown by useMyListings.archiveListing
  } finally {
    isDeleting.value = false;
  }
}

// Handle discard draft confirmation
async function handleDiscardConfirm() {
  isDeleting.value = true;
  try {
    // Use draftId if available (for actual drafts), otherwise use id
    const draftId = props.listing.draftId ?? props.listing.id;
    
    // Use the draft listings composable for delete
    const { deleteDraft } = useDraftListings();
    await deleteDraft(draftId);
    discardDialog.value?.close();
  } catch (error) {
    // Error already handled in composable
  } finally {
    isDeleting.value = false;
  }
}

// Open restore confirmation dialog
function openRestoreDialog() {
  restoreDialog.value?.open();
}

// Handle restore confirmation
async function handleRestoreConfirm() {
  isRestoring.value = true;
  try {
    await restoreListing(props.listing.id);
    restoreDialog.value?.close();
    // Refresh aggregates so sidebar badges update
    const { fetchUserItemsAggregates } = useNotifications();
    await fetchUserItemsAggregates(true);
  } catch {
    toast.add({ title: "Error", description: "Failed to restore listing", color: "error" });
  } finally {
    isRestoring.value = false;
  }
}
</script>
