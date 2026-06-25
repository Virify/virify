<template>
  <div
    class="o-listing-buttons"
    role="presentation"
    v-if="signup || isAdmin"
  >
    <!-- @TODO we should move this v-if to the parent -->
    <AtomsNoteButton
      v-if="!isDraft"
      class="o-listing-buttons__fav | button"
      :listing-id="listingId"
    />
    <AtomsFavouriteButton
      v-if="!isDraft"
      class="o-listing-buttons__fav | button"
      :listing-id="listingId"
    />

    <AtomsReportButton
      v-if="!isDraft"
      :listing-id="listingId"
    />

    <AtomsEnquireButton
      v-if="!isDraft && agent?.id"
      :listing-id="listingId"
      :listing-type="listingType"
      :user-id="agent.id"
      analytics-location="listing_detail"
      class="o-listing-buttons__contact | button button-secondary button-full"
    >
      Enquire
    </AtomsEnquireButton>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    listingId: number;
    listingType: "sale" | "rent";
    agent?: {
      username?: string | null;
      email?: string | null;
      id?: number | null;
      createdAt?: Date | String | null;
      avatar?: string | null;
    };
    isDraft?: boolean;
  }
  const { signup, isAdmin } = useFeatureFlag();

  const props = defineProps<Props>();
</script>

<style lang="scss">
  .o-listing-buttons {
    display: flex;
    align-items: center;
    gap: var(--size-8);

    &__contact {
      white-space: nowrap;
      padding-inline: var(--size-32);
    }

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
      flex-shrink: 0;
      min-width: var(--size-24);
      min-height: var(--size-24);
    }

    &__fav {
      &:hover {
        opacity: 0.8;
      }
    }
  }
</style>
