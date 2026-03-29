<template>
  <button @click.prevent="handleEnquire" :disabled="disabled || isEnquiryDisabled">
    <slot>Enquire</slot>
  </button>
</template>

<script setup lang="ts">
import { ViewsDialogConversation, ViewsDialogLogin } from '#components'

interface Props {
  listingId: number;
  userId?: number | null;
  disabled?: boolean
}

const props = defineProps<Props>();

/**
 *  Validate user, viewer IDs
 */
const { user: sessionUser } = useUserSession();

const safeUserId = computed(() => {
  const { userId } = props

  return isNumber(userId) ? userId : null
})

const sessionId = computed(() => {
  return sessionUser.value?.id
})

const isSelf = computed(() => {
  return sessionId.value === safeUserId.value
});

const isEnquiryDisabled = computed(() => {
  return !safeUserId.value || isSelf.value
});

/**
 *  Dialog
 */
const { showDialog } = useDialog();

function handleEnquire() {
  if (!sessionId.value) {
    showDialog({
      component: ViewsDialogLogin,
    });

    return;
  }

  showDialog({
    component: ViewsDialogConversation,
    props: {
      listingId: props.listingId,
      receiverId: safeUserId.value
    },
  });
}
</script>
