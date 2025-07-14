<template>
  <div class="m-listing-card-actions">
    <nuxt-link :to="`/listing/${listingId}`" class="| button button-secondary body-sm">
      View
    </nuxt-link>
    <button class="| button button-ghost body-sm" :disabled="isEnquiryDisabled" @click="onEnquire">
      {{ enquiryLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import ViewsDialogEnquiry from '~/components/views/Dialog/ViewsDialogEnquiry.vue';
import ViewsDialogLogin from '~/components/views/Dialog/ViewsDialogLogin.vue';

interface Props {
  listingId: number;
  userId: number;
}
const props = defineProps<Props>();

const { hasEnquired, loadingEnquiries } = useEnquiry();
const { showDialog } = useDialog();
const { user } = useUserSession();

const safeUserId = computed(() =>
  typeof props.userId === 'number' && !isNaN(props.userId) ? props.userId : null
);

const isSelf = computed(() => safeUserId.value !== null && user.value?.id === safeUserId.value);

const isEnquiryDisabled = computed(() =>
  !safeUserId.value || hasEnquired(props.listingId) || loadingEnquiries.value || isSelf.value
);

const enquiryLabel = computed(() =>
  isSelf.value
    ? 'Enquire'
    : hasEnquired(props.listingId)
      ? 'Enquiry Sent'
      : 'Enquire'
);

function onEnquire() {
  if (!user.value || !user.value.id) {
    showDialog({
      component: ViewsDialogLogin,
    });
    return;
  }
  if (safeUserId.value !== null && !isSelf.value) {
    showDialog({
      component: ViewsDialogEnquiry,
      props: { listingId: props.listingId, receiverId: safeUserId.value },
    });
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
    border-color: var(--secondary-400);
  }
}
</style>
