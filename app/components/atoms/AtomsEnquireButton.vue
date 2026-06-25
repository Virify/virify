<template>
  <button
    @click.prevent="handleEnquire"
    :disabled="disabled || isEnquiryDisabled"
  >
    <slot>Enquire</slot>
  </button>
</template>

<script setup lang="ts">
  import { ViewsDialogLogin } from "#components";

  interface Props {
    listingId: number;
    listingType: "sale" | "rent";
    userId?: number | null;
    disabled?: boolean;
    analyticsLocation?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    analyticsLocation: "unknown",
  });

  /**
   *  Validate user, viewer IDs
   */
  const { user: sessionUser } = useUserSession();

  const safeUserId = computed(() => {
    const { userId } = props;

    return isNumber(userId) ? userId : null;
  });

  const sessionId = computed(() => {
    return sessionUser.value?.id;
  });

  const isSelf = computed(() => {
    return sessionId.value === safeUserId.value;
  });

  const isEnquiryDisabled = computed(() => {
    return !safeUserId.value || isSelf.value;
  });

  const { showDialog } = useDialog();
  const { openNewEnquiry } = useGlobalEnquiryModal();
  const { trackEnquiryButtonClick } = useGoogleAnalyticsEvents();
  const { setContext } = useEnquiryGaFunnel();

  function handleEnquire() {
    const clickId = crypto.randomUUID();
    const authenticated = !!sessionId.value;

    trackEnquiryButtonClick({
      clickId,
      listingId: props.listingId,
      listingType: props.listingType,
      location: props.analyticsLocation,
      authenticated,
    });

    setContext({
      clickId,
      listingId: props.listingId,
      listingType: props.listingType,
      location: props.analyticsLocation,
      authenticated,
    });

    if (!authenticated) {
      showDialog({
        component: ViewsDialogLogin,
      });

      return;
    }

    if (safeUserId.value !== null) {
      openNewEnquiry(props.listingId, safeUserId.value, props.listingType);
    }
  }
</script>
