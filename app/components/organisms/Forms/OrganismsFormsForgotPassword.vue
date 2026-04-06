<template>
  <MoleculesForm method="POST" action="/auth/password-reset" @submit.prevent="resetPassword" class="| stacked"
    :error="formErrors">
    <MoleculesFormField label="Email address" v-slot="{ id }">
      <AtomsInput :id v-model="email" type="email" name="email" required />
    </MoleculesFormField>

    <div ref="turnstileEl"></div>
    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending"> Submit </AtomsButton>
  </MoleculesForm>
</template>

<script setup lang="ts">
/**
 *  Emits
 */
const emits = defineEmits(['form-success']);

/**
 *  Composables
 */
const { isPending, setPendingWhile } = usePending();
const { turnstileEl, initializeTurnstile, executeTurnstile, resetTurnstile, cleanupTurnstile } = useTurnstile();

/**
 *  Form data
 */
const email = ref('')

/**
 *  Handle errors
 */
const formErrors = ref();

onMounted(() => initializeTurnstile());
onUnmounted(() => cleanupTurnstile());

/**
 *  Validate form and submit
 */
async function resetPassword({ target }: SubmitEvent) {
  if (isPending.value) return;

  setPendingWhile(async () => {
    // Clear any existing form errors
    formErrors.value = null;

    // Basic validation
    if (!email.value) {
      formErrors.value = {
        title: 'Please fill in all fields',
        message: 'Email is required.',
      };
      return;
    }

    // Post data
    let turnstileToken: string;
    try {
      turnstileToken = await executeTurnstile();
    } catch {
      formErrors.value = {
        title: 'Bot verification failed',
        message: 'Unable to complete bot verification. Please refresh and try again.',
      };
      return;
    }

    await $fetch('/auth/password-reset', {
      method: 'POST',
      body: {
        email: email.value,
        turnstileToken,
      },
    })
      .then(({ passwordToken }) => {
        emits('form-success', passwordToken);
      })
      .catch((error) => {
        resetTurnstile();
        formErrors.value = {
          title: 'Password reset failed',
          message: error.data.message,
        };
      });
  });
}
</script>
