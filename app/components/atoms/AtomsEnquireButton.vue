<template>
  <button @click.prevent="handleEnquire" :disabled="isEnquiryDisabled">
    <slot>
      {{ defaultContent }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { ViewsDialogEnquiry, ViewsDialogLogin } from '#components'

interface Props {
  listingId: number;
  userId: number;
}

const props = defineProps<Props>();

const { hasEnquired, loadingEnquiries } = useEnquiry();
const { showDialog } = useDialog();
const { user } = useUserSession();

const safeUserId = computed(() => {
  const { userId } = asObject(props)

  return Number.isNaN(userId) ? null : userId
})

const isSelf = computed(() => {
  return safeUserId.value !== null && user.value?.id === safeUserId.value
});

const isEnquiryDisabled = computed(() => {
  const { listingId } = asObject(props)

  return !safeUserId.value || hasEnquired(listingId) || loadingEnquiries.value || isSelf.value
});

const defaultContent = computed(() => {
  const { listingId } = asObject(props)

  return isSelf.value
    ? 'Enquire'
    : hasEnquired(listingId)
      ? 'Enquiry Sent'
      : 'Enquire'
});

function handleEnquire() {
  if (isEnquiryDisabled.value) return;

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
