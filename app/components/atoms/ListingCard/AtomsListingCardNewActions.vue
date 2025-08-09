<template>
  <div class="m-listing-card-actions" role="group" aria-label="Property actions">
    <nuxt-link :to="`/listing/${listingId}`" class="| button button-primary body-sm"
      aria-label="View property details" title="View property details">
      View
    </nuxt-link>
    <button class="| button button-ghost body-sm" :disabled="enquiryState.isDisabled" @click="onEnquire" 
        :aria-label="enquiryState.isDisabled ? 'Cannot enquire about this property' : 'Send enquiry about this property'"
        :title="enquiryState.isDisabled ? 'Cannot enquire about this property' : 'Send enquiry about this property'">
      {{ enquiryState.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingId: number;
  userId: number;
}
const props = defineProps<Props>();

const { getEnquiryState, handleEnquiryClick } = useEnquiry();

const enquiryState = computed(() => getEnquiryState(props.listingId, props.userId));

function onEnquire() {
  handleEnquiryClick(props.listingId, props.userId);
}
</script>
<style lang="scss">
.m-listing-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-8);
  width: 100%;

  .button {
    width: 100%;
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    border-color: var(--secondary-400);
  }
}
</style>
