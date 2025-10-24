<template>
  <div v-if="conversation && conversation.listing" class="property-header">
    <NuxtLink :to="`/listing/${conversation.listing.id}`" target="_blank">
    <div class="property-main-row">
      <div class="property-image" v-if="firstImage">
        <AtomsCloudFlareImage
          :src="firstImage"
          alt="Property image"
          variant="thumbnail"
          :placeholder="true"
        />
      </div>
      <div class="property-details">
        <div class="property-info">
          <h3 class="property-price | title-sm">{{ priceFormatted }}</h3>
          <p class="property-address | body-xs">{{ address }}</p>
        </div>
        <div class="agent-info">
          <AtomsPill v-if="isMyProperty" class="property-badge | body-xs">Your Property</AtomsPill>
          <div class="agent-details">
            <div class="agent-avatar">
              <AtomsIcon icon="profile" size="28" />
            </div>
            <span class="agent-name | body-sm">{{ conversation.listing.user?.username  }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="agent-info-row">
      <AtomsPill v-if="isMyProperty" class="property-badge | body-xs">Your Property</AtomsPill>
      <div class="agent-details">
        <div class="agent-avatar">
          <AtomsIcon icon="profile" size="28" />
        </div>
        <!-- Show listing owner in the compact (narrow) layout as well -->
        <span class="agent-name | body-sm">{{ conversation.listing.user?.username }}</span>
      </div>
    </div>
    </NuxtLink>
  </div>
  <div v-else class="property-header property-header--empty">
    <p class="body-xs">No listing details available.</p>
  </div>
</template>

<script setup lang="ts">
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";

const props = defineProps<{
  conversation: ConversationWithUserAndMessages | null;
}>();

const listing = computed(() => props.conversation?.listing)
const property = computed(() => listing.value?.property)

const firstImage = computed(() => {
  const media = property.value?.media
  if (!Array.isArray(media)) return null
  return media.find(m => m.image)?.image
})

const address = computed(() => property.value?.address?.fullAddress || "Address not provided")

const priceFormatted = computed(() => {
  const price = listing.value?.price
  if (!price) return ""
  return `£${parseInt(String(price)).toLocaleString()}`
})

const { user } = useUserSession()

const isMyProperty = computed(() => {
  return listing.value?.user?.id === user.value?.id
})
</script>

<style lang="scss" scoped>
.property-header {
  margin: 0 0 var(--size-16) 0;
  overflow: hidden;
  container-type: inline-size;

  a {
    text-decoration: none;
  }

  /* Default: vertical layout (narrow containers) */
  display: flex;
  flex-direction: column;
  gap: var(--size-8);

  /* Side by side when there's enough room */
  @container (min-width: 400px) {
    flex-direction: row;
    align-items: center;
    gap: var(--size-12);
  }

  .property-main-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--size-12);
    flex: 1;
  }

  .property-image {
    width: 80px;
    height: 60px;
    flex-shrink: 0;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .property-details {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    color: var(--foreground-100);
    min-width: 0;

    .agent-info {
      display: none;

      /* Show when side by side layout */
      @container (min-width: 400px) {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--size-4);
        margin-left: var(--size-12);
      }
    }
  }

  .agent-info-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--size-8);
    flex-shrink: 0;
    padding-top: var(--size-8);
    /* Hide when side by side layout */
    @container (min-width: 400px) {
      display: none;
    }
  }

  .property-info {
    margin-bottom: 0;
    flex: 1;
    min-width: 0;
  }

  .property-price {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 var(--size-2) 0;
  }

  .property-address {
    font-size: 0.75rem;
    margin: 0;
  }

  .property-badge {
    flex-shrink: 0;
  }

  .agent-details {
    display: flex;
    align-items: center;
    gap: var(--size-8);
  }

  .a-pill {
    background: var(--blue-400);
    color: var(--monochrome-900);
  }

  .agent-avatar {
    width: var(--size-32);
    height: var(--size-32);
    background: var(--background-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .agent-name {
    flex: 1;
  }

  &--empty {
    padding: var(--size-20);
    opacity: 0.7;
    color: var(--foreground-100);
  }
}
</style>
