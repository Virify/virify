<template>
  <div @click="handleContact">
    <slot :disabled="isContactDisabled" :contact-label="contactLabel">
      <button class="| button button-ghost button-full body-sm" :disabled="isContactDisabled">{{ contactLabel }}</button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import ViewsDialogConversation from '~/components/views/Dialog/ViewsDialogConversation.vue';
import ViewsDialogLogin from '~/components/views/Dialog/ViewsDialogLogin.vue';

interface Props {
  listingId: number;
  userId: number;
}
const props = defineProps<Props>();

const { hasConversation, loadingConversations } = useConversations();
const { showDialog } = useDialog();
const { user } = useUserSession();

const safeUserId = computed(() =>
  typeof props.userId === 'number' && !isNaN(props.userId) ? props.userId : null
);

const isSelf = computed(() => safeUserId.value !== null && user.value?.id === safeUserId.value);

const isContactDisabled = computed(() =>
  !safeUserId.value || hasConversation(props.listingId) || loadingConversations.value || isSelf.value
);

const contactLabel = computed(() =>
  isSelf.value
    ? 'Contact'
    : hasConversation(props.listingId)
      ? 'Message Sent'
      : 'Contact'
);

function handleContact() {
  if (isContactDisabled.value) return;
  
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
<style scoped lang="scss">
.button {
  width: 100%;
  padding: var(--size-8);
  border-radius: var(--border-radius-lg);
  box-sizing: border-box;
}
</style>
