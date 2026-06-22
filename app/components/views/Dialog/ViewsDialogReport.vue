<template>
  <div class="| flow dialog-container dialog-container-sm">
    <h1 class="| title-xl">Report</h1>
    <p class="| body-md">Noticed something wrong? Let us know and we'll look into it.</p>

    <MoleculesForm
      @submit.prevent="submitForm"
      class="| stacked"
      :error="formError"
    >
      <MoleculesFormField
        v-if="!hasAccount"
        label="Email Address"
        v-slot="{ id }"
      >
        <AtomsInput
          :id
          v-model="form.email"
          type="email"
          name="email"
          required
          :disabled="isSubmitting"
          placeholder="Your email address"
        />
      </MoleculesFormField>

      <MoleculesFormField
        label="Type"
        v-slot="{ id }"
      >
        <select
          :id
          v-model="form.type"
          name="type"
          required
          :disabled="isSubmitting"
          class="support-dialog__select | body-sm"
        >
          <option value="">Select type...</option>
          <option value="inappropriate-content">Inappropriate Content</option>
          <option value="incorrect-information">Incorrect Information</option>
          <option value="inaccurate-listing">Inaccurate Listing</option>
          <option value="other">Other</option>
        </select>
      </MoleculesFormField>

      <MoleculesFormField
        label="Details"
        v-slot="{ id }"
      >
        <textarea
          :id
          v-model="form.details"
          name="details"
          rows="5"
          required
          :disabled="isSubmitting"
          placeholder="Please describe your report in as much detail as possible to help us investigate the issue."
          class="support-dialog__textarea | text-sm"
        ></textarea>
      </MoleculesFormField>

      <!-- Cloudflare Turnstile -->
      <div class="support-dialog__turnstile">
        <div ref="turnstileEl"></div>
      </div>

      <div class="support-dialog__actions">
        <AtomsButton
          type="button"
          @click="hideDialog"
          class="| button button-monochrome button-sm"
          :disabled="isSubmitting"
        >
          Cancel
        </AtomsButton>
        <AtomsButton
          type="submit"
          class="| button-secondary button-sm"
          :pending="isSubmitting"
        >
          Send Report Request
        </AtomsButton>
      </div>
      <p class="support-dialog__alt-email | body-sm">
        Alternatively you can email us on
        <a href="mailto:support@virify.co.uk">support@virify.co.uk</a>
      </p>
    </MoleculesForm>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";

  interface Props {
    listingId?: number;
    conversationId?: number;
    messageId?: number;
    message?: string;
    userId?: number;
  }

  const props = defineProps<Props>();

  const selectedType = computed(() => {
    if (props.listingId) {
      return "inaccurate-listing";
    } else if (props.conversationId) {
      return "incorrect-information";
    } else if (props.messageId) {
      return "inappropriate-content";
    } else {
      return "other";
    }
  });

  const { hideDialog } = useDialog();
  const { user } = useUserSession();
  const toast = useToast();
  const {
    turnstileToken,
    turnstileEl,
    initializeTurnstile,
    executeTurnstile,
    resetTurnstile,
    cleanupTurnstile,
  } = useTurnstile();

  const form = ref({
    name: "",
    email: "",
    type: selectedType.value,
    details: "",
  });

  const isSubmitting = ref(false);
  const formError = ref<{ title: string; message: string } | null>(null);
  const hasAccount = computed(() => !!user.value);

  async function submitForm() {
    if (isSubmitting.value) return;

    formError.value = null;
    isSubmitting.value = true;

    try {
      await executeTurnstile();

      await $fetch("/api/report", {
        method: "POST",
        body: {
          email: hasAccount.value ? user.value?.email : form.value.email,
          type: form.value.type,
          details: form.value.details,
          turnstileToken: turnstileToken.value,
          listingId: props.listingId,
          conversationId: props.conversationId,
          messageId: props.messageId,
          message: props.message,
          userId: props.userId,
        },
      });

      toast.add({
        title: "Success",
        description: "Support request submitted successfully!",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      hideDialog();
    } catch (err) {
      console.error("Support form submission error:", err);
      formError.value = {
        title: "Support request failed",
        message: "Failed to send support request. Please try again.",
      };
      resetTurnstile();
    } finally {
      isSubmitting.value = false;
    }
  }

  onMounted(() => {
    initializeTurnstile();
  });

  onUnmounted(() => {
    cleanupTurnstile();
  });
</script>

<style lang="scss" scoped>
  @use "#styles/_utils/media" as mq;

  .support-dialog {
    &__textarea {
      width: 100%;
      padding: var(--size-12);
      border: 1px solid var(--background-300);
      border-radius: var(--border-radius-lg);
      background: var(--background-100);
      resize: vertical;
      min-height: var(--size-120);
      font-size: var(--font-sm);
      line-height: var(--lineheight-sm);

      &:focus {
        outline: none;
        border-color: var(--primary-400);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &__select {
      width: 100%;
      padding: var(--size-12);
      border: 1px solid var(--background-300);
      border-radius: var(--border-radius-lg);
      background: var(--background-100);
      appearance: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='%23666'><path d='M20 23.4L14 17.4L15.4 16L20 20.6L24.6 16L26 17.4L20 23.4Z'/></svg>");
      background-repeat: no-repeat;
      background-position: right var(--size-12) center;
      background-size: var(--size-16) var(--size-16);
      padding-right: var(--size-40);

      &:focus {
        outline: none;
        border-color: var(--primary-400);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &__success {
      color: var(--success-500);
      background: var(--success-50);
      border: 1px solid var(--success-200);
      border-radius: var(--border-radius-md);
      padding: var(--size-12);
    }

    &__turnstile {
      display: flex;
      justify-content: center;
      margin: var(--size-16) 0;
    }

    &__alt-email {
      text-align: center;
      opacity: 0.6;
      margin-top: var(--size-8);

      a {
        text-decoration: underline;
      }
    }

    &__actions {
      display: flex;
      gap: var(--size-16);
      justify-content: flex-end;
      margin-top: var(--size-16);

      @include mq.mobile-only {
        flex-direction: column;

        :deep(button) {
          width: 100%;
        }
      }
    }
  }
</style>
