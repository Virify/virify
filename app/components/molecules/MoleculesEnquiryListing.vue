<template>
  <div v-if="conversation && conversation.listing" class="property-header">
    <div class="property-image" v-if="firstImage">
      <NuxtImg 
        :src="firstImage" 
        alt="Property image" 
        width="268" 
        height="100"
        loading="eager"
        sizes="268px"
        format="webp,jpg"
        quality="80"
        placeholder="/img/preload.svg"
      />
      <div class="property-badge | body-sm font-semibold">Your Property</div>
    </div>
    <div class="property-details">
      <div class="property-info">
        <h3 class="property-price | title-sm">{{ priceFormatted }}</h3>
        <p class="property-address | body-xs">{{ address }}</p>
      </div>
      <div class="agent-info">
        <div class="agent-avatar">
          <AtomsIcon icon="profile" size="28" />
        </div>
        <span class="agent-name | body-sm">{{ conversation.sender?.username }}</span>
      </div>
    </div>
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
</script>

<style lang="scss" scoped>
.property-header {
  background: var(--background-100);
  border-radius: var(--border-radius-2xl);
  margin: 0 0 var(--size-16) 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &--empty {
    padding: var(--size-20);
    opacity: 0.7;
    color: var(--foreground-100);
  }

  .property-image {
    position: relative;
    width: 100%;
    height: 120px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .property-badge {
    position: absolute;
    top: var(--size-8);
    left: var(--size-8);
    background: var(--secondary-400);
    color: var(--foreground-100);
    padding: var(--size-4) var(--size-8);
    border-radius: var(--border-radius-2xl);
  }

  .property-details {
    padding: var(--size-16);
    color: var(--foreground-100);
  }

  .property-info {
    margin-bottom: var(--size-12);
  }

  .property-price {
    margin: 0 0 var(--size-4) 0;
  }

  .property-address {
    margin: 0;
  }

  .agent-info {
    display: flex;
    align-items: center;
    gap: var(--size-8);
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
}
</style>
