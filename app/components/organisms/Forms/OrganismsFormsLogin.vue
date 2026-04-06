<template>
  <MoleculesForm method="POST" action="/auth/login" @submit.prevent="loginUser" class="| stacked" :error="formErrors">
    <MoleculesFormField label="Email address" v-slot="{ id }">
      <AtomsInput :id v-model="email" type="email" name="email" required />
    </MoleculesFormField>

    <MoleculesFormPassword label="Password" v-model="password" type="password" name="password" required minlength="8" />

    <div ref="turnstileEl"></div>
    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending"> Log in </AtomsButton>
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
const { pattern, validityText } = getValidPassword();
const { isPending, setPendingWhile } = usePending();
const { turnstileEl, turnstileToken, initializeTurnstile, executeTurnstile, resetTurnstile, cleanupTurnstile } = useTurnstile();

/**
 *  Form data
 */
const email = ref('')
const password = ref('')

/**
 *  Handle errors
 */
const formErrors = ref();

onMounted(() => initializeTurnstile());
onUnmounted(() => cleanupTurnstile());

/**
 *  Validate form and submit
 */
async function loginUser({ target }: SubmitEvent) {
  if (isPending.value) return;

  setPendingWhile(async () => {
    // Clear any existing form errors
    formErrors.value = null;

    // Basic validation
    if (!email.value || !password.value) {
      formErrors.value = {
        title: 'Please fill in all fields',
        message: 'Email and password are required.',
      };
      return;
    }

    // Post data
    await executeTurnstile();
    await $fetch('/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        turnstileToken: turnstileToken.value,
      },
    })
      .then(() => {
        emits('form-success');
      })
      .catch((error) => {
        resetTurnstile();
        formErrors.value = {
          title: 'Login failed',
          message: error.data.message,
        };
      });
  });
}
</script>
