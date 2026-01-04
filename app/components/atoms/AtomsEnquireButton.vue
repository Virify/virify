<template>
  <button @click.prevent="handleEnquire" :disabled="isEnquiryDisabled">
    <slot>
      {{ defaultContent }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { ViewsDialogConversation, ViewsDialogLogin } from '#components'

interface Props {
  listingId: number;
  userId?: number | null;
}

const props = defineProps<Props>();

const { showDialog } = useDialog();
const { user } = useUserSession();

const safeUserId = computed(() => {
  const { userId } = props

  return userId && !Number.isNaN(userId) ? userId : null
})

const isSelf = computed(() => {
  return safeUserId.value !== null && user.value?.id === safeUserId.value
});

const isEnquiryDisabled = computed(() => {
  return !safeUserId.value || isSelf.value
});

const defaultContent = computed(() => {
  return isSelf.value ? 'Your Listing' : 'Enquire'
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
      component: ViewsDialogConversation,
      props: { listingId: props.listingId, receiverId: safeUserId.value },
    });
  }
}
</script>
