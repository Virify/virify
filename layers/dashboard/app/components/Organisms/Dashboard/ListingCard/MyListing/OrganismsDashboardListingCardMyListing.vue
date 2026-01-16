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
    <AtomsCloudFlareImage v-if="listing?.property?.media[0]" :src="listing?.property?.media[0]?.image!" alt="Listing image" variant="gallery" :placeholder="true" class="w-full h-54 object-cover rounded-lg aspect-4/3" />

    <template #header>
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <p class="body-md m-0">
            <span class="font-bold body-md">{{ formatCurrency(listing.price) }}</span>
            <span v-if="priceType" class="text-muted-foreground"> / {{ priceType }}</span>
          </p>
          <UBadge v-if="listing.isDraft" size="md" color="secondary" variant="subtle">Draft</UBadge>
          <UBadge v-else-if="listing.archived" size="md" color="secondary" variant="subtle">Archived</UBadge>
          <UBadge size="md" color="secondary" variant="subtle">{{ listing.rentalListing ? "For Rent" : "For Sale" }}</UBadge>
          <UBadge v-if="tierBadge" size="md" color="secondary" variant="outline">{{ tierBadge }}</UBadge>
        </div>
      </div>
    </template>

    <template #description>
      <div class="flex flex-col gap-3 h-full">
        <p class="body-sm text-foreground mt-1!">{{ formattedAddress }}</p>
        <div class="flex flex-row flex-wrap gap-1">
          <UBadge icon="i-lucide-bed-double" size="md" color="secondary" variant="subtle">{{ listing?.property?.numberBedrooms }} bed</UBadge>
          <UBadge icon="i-lucide-bath" size="md" color="secondary" variant="subtle">{{ listing?.property?.numberBathrooms }} bath</UBadge>
          <UBadge v-if="listing?.property?.outdoorSpace?.garden?.length" icon="i-lucide-fence" size="md" color="secondary" variant="subtle">{{ listing?.property?.outdoorSpace?.garden.length }} garden</UBadge>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge icon="i-lucide-eye" size="md" color="primary" variant="solid" :title="`${listing.analytics.viewsCount} views`">{{ listing.analytics.viewsCount }}</UBadge>
          <UBadge icon="i-lucide-heart" size="md" color="primary" variant="solid" :title="`${listing.analytics.favouritesCount} favourites`">{{ listing.analytics.favouritesCount }}</UBadge>
          <UBadge icon="i-lucide-mail" size="md" color="primary" variant="solid" :title="`${listing.analytics.enquiriesCount} enquiries`">{{ listing.analytics.enquiriesCount }}</UBadge>
        </div>
        <div v-if="!listing.isDraft && !listing.archived">
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
        </div>

        <div class="flex flex-wrap gap-2 mt-auto pt-2">
          <UButton variant="subtle" size="xs" color="secondary" class="font-semibold flex-1 justify-center" icon="i-lucide-pencil" label="Edit" :to="editHref" />
          <UButton variant="subtle" size="xs" color="secondary" class="font-semibold flex-1 justify-center" :to="`/listing/${listing.id}`" target="_blank" icon="i-lucide-eye" label="View" :disabled="!listing.published && !listing.isDraft" />
          <UButton v-if="!listing.isDraft" variant="subtle" size="xs" color="error" class="font-semibold flex-1 justify-center cursor-pointer" :disabled="isDeleting" @click="handleDelete" icon="i-lucide-trash-2" label="Delete" />
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">

interface Props {
  listing: OwnedListingWithAnalytics;
}

const props = defineProps<Props>();

const { archiveListing, setPublished } = useMyListings();
const toast = useToast();

const isDeleting = ref(false);
const isUpdating = ref(false);
const isPublished = ref(props.listing.published);

const formattedAddress = computed(() => {
  const address = props.listing.property?.address;
  if (!address) return "";
  return [address.street, address.city, address.postcode?.split(" ")[0]].filter(Boolean).join(", ");
});

const priceType = computed(() => {
  const type = props.listing.saleListing?.priceType || props.listing.rentalListing?.rentFrequency;
  return type ? convertEnumToCapalizedString(type) : "";
});

const editHref = computed(() => {
  if (props.listing.isDraft) {
    return `/account/create-listing/${props.listing.id}`;
  }
  return `/account/edit-listing/${props.listing.id}`;
});

const tierBadge = computed(() => {
  const tier = String(props.listing.listingTier || "").toLowerCase();
  if (tier === "premium") return "Premium";
  if (tier === "featured") return "Featured";
  return null;
});

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

async function handleDelete() {
  const confirmed = confirm("Are you sure you want to archive this listing? This will unpublish it and mark it as archived.");

  if (!confirmed) return;

  isDeleting.value = true;
  try {
    await archiveListing(props.listing.id);
    toast.add({
      title: "Success",
      description: "Listing archived successfully",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to archive listing",
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>
