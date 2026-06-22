<template>
  <UTooltip :text="tooltip">
    <UIcon
      class="cursor-pointer shrink-0 p-1 h-6 w-5"
      :class="{
        'text-error': props.color === 'error',
        'text-white': props.color === 'neutral',
        'text-warning': props.color === 'warning',
        'text-success': props.color === 'success',
        'text-info': props.color === 'info',
      }"
      name="i-lucide-triangle-alert"
      @click.stop="openModal"
    />
  </UTooltip>
</template>
<script setup lang="ts">
  interface Props {
    color?: "neutral" | "error" | "warning" | "success" | "info";
    listingId?: number;
    conversationId?: number;
    messageId?: number;
    message?: string;
    userId?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: "error",
  });

  import { ViewsDialogReport } from "#components";
  const { showDialog } = useDialog();

  const openModal = () => {
    showDialog({
      component: ViewsDialogReport,
      props: {
        listingId: props.listingId,
        conversationId: props.conversationId,
        messageId: props.messageId,
        message: props.message,
        userId: props.userId,
      },
    });
  };

  const tooltip = computed(() => {
    if (props.listingId) {
      return "Report this listing";
    } else if (props.conversationId) {
      return "Report this conversation";
    } else if (props.messageId) {
      return "Report this message";
    } else {
      return "Report content";
    }
  });
</script>
