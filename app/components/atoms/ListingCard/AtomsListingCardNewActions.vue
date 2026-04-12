<template>
  <div class="m-listing-card-actions" role="group" aria-label="Property actions">
    <nuxt-link :to="`/listing/${listingId}`" class="| button button-primary body-sm" aria-label="View property details"
      title="View property details">
      View
    </nuxt-link>
    <button class="| button button-ghost body-sm" :disabled="conversationState.isDisabled" @click="onContact"
      :aria-label="conversationState.isDisabled ? 'Cannot contact about this property' : 'Contact about this property'"
      :title="conversationState.isDisabled ? 'Cannot contact about this property' : 'Contact about this property'">
      {{ conversationState.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogLogin } from '#components'

interface Props {
  listingId: number;
  userId: number;
}
const props = defineProps<Props>();

const { showDialog } = useDialog();
const { user } = useUserSession();
const { openNewEnquiry } = useGlobalEnquiryModal();

const safeUserId = computed(() =>
  typeof props.userId === 'number' && !isNaN(props.userId) ? props.userId : null
);

const isSelf = computed(() => safeUserId.value !== null && user.value?.id === safeUserId.value);

const conversationState = computed(() => ({
  isDisabled: !safeUserId.value || isSelf.value,
  label: isSelf.value ? 'Your Listing' : 'Contact'
}));

function onContact() {
  if (conversationState.value.isDisabled) return;

  if (!user.value || !user.value.id) {
    showDialog({
      component: ViewsDialogLogin,
    });
    return;
  }

  if (safeUserId.value !== null && !isSelf.value) {
    openNewEnquiry(props.listingId, safeUserId.value);
  }
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
    border-color: var(--primary-400);
  }
}
</style>
