<template>
  <OrganismsListingCardBase :listing="listing">
    <template #featured-banner>
      <span class="m-listing-card-featured-tag | body-xs">
        Featured
      </span>
    </template>

    <!-- Property Tags (Chain Free, Listed Date, etc.) -->
    <template #tags>
      <AtomsListingCardNewTags
        :chain-free="listing.property.chainFree"
        :listed-date="listing.property.createdAt"
        :reduced="true"
      >
        <template #default="{ tags }">
          <ul class="featured-tags">
            <li v-for="tag in tags" :key="tag" class="featured-tag | body-xs">
              {{ tag }}
            </li>
          </ul>
        </template>
      </AtomsListingCardNewTags>
    </template>

    <template #agent>
      <AtomsListingCardNewAgent
        :username="listing.user.username"
        :id="listing.user.id"
      >
        <template #default="{ username }">
          <NuxtLink to="#" class="featured-agent">
            <div class="featured-agent-logo">
              <AtomsIcon name="check" icon="tick-solid" />
            </div>
            <p class="featured-agent-text | body-xs font-semibold">
              {{ username }}
            </p>
          </NuxtLink>
        </template>
      </AtomsListingCardNewAgent>
    </template>

    <template #actions>
      <div class="featured-actions">
        <OrganismsListingCardNewView :listing-id="listing.id">
          <span class="| button button-secondary button-full body-sm"
            >View</span
          >
        </OrganismsListingCardNewView>
        <AtomsListingCardNewEnquire
          :listing-id="listing.id"
          :user-id="listing.user.id"
        />
      </div>
    </template>
  </OrganismsListingCardBase>
</template>

<script lang="ts" setup>
interface Props {
  listing: ListingCardData;
}

const props = defineProps<Props>();
</script>

<style lang="scss">
.m-listing-card[data-tier="FEATURED"] {
  border-color: var(--secondary-400);
  border-width: var(--size-4);
  padding: 0;

  .m-listing-card-image-container {
    border-radius: calc(var(--border-radius-2xl) - var(--size-1));
  }

  .m-listing-card-content {
    padding: var(--card-padding);
  }

  .m-listing-card-featured-tag {
    background-color: var(--secondary-400);
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-900);
    min-width: 125px;
    padding: var(--size-8);
    text-align: center;
    position: absolute;
    top: 18px;
    left: var(--size-16);
    z-index: 3;
  }

  // Sale tag positioning
  .m-listing-card-type-indicator {
    background-color: var(--secondary-400);
    color: var(--monochrome-900);
    opacity: 1;

    // Only apply absolute positioning on large desktop screens
    @media (min-width: 1201px) {
      position: absolute;
      top: var(--size-16);
      right: var(--size-16);
      z-index: 10;
    }
  }

  // Image controls styling
  .m-listing-card-arrow-button {
    background-color: var(--secondary-400);
    color: var(--monochrome-900);

    svg {
      color: var(--monochrome-900);
    }
  }

  .m-listing-card-image-counter {
    background-color: var(--secondary-400);
    color: var(--monochrome-900);
  }

  .m-listing-card-image-actions {
    background-color: var(--secondary-400);
  }

  .a-favourite-button:not(.selected),
  .note-button {
    color: var(--monochrome-100);
  }
  
&[data-tier="FEATURED"] .m-listing-card-image-actions .a-favourite-button.selected {
    color: var(--favourite-colour);
  }

  &[data-tier="FEATURED"] .m-listing-card-image-actions .a-favourite-button.selected svg {
    stroke: var(--monochrome-900);
  }
  
  .note-button-icon {
    color: var(--monochrome-100);
  }

  .button {
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
  }
}

@media (max-width: 1200px) {
  .m-listing-card[data-tier="FEATURED"] {
    .m-listing-card-content {
      padding: var(--card-padding);
    }
  }
}

.featured {

    // Agent section
  &-agent {
    align-items: center;
    display: flex;
    gap: var(--size-8);
    text-decoration: none;
    color: white;

    &-logo {
      align-items: center;
      background-color: var(--secondary-400);
      border-radius: 50%;
      color: var(--monochrome-900);
      display: flex;
      font-size: var(--font-2xl);
      height: var(--size-32);
      justify-content: center;
      width: var(--size-32);
    }

    &-text {
      color: var(--foreground-100);
    }
  }


  &-actions {
    display: grid;
    gap: var(--size-8);
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    list-style: none;
    padding: 0;
  }

  &-tag {
    background-color: var(--secondary-400);
    opacity: 1;
    color: var(--monochrome-900);
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
  }
}
</style>
