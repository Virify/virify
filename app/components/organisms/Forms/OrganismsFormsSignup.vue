<template>
  <MoleculesForm method="POST" action="/auth/signup" @submit.prevent="createAccount" class="| stacked"
    :error="formErrors">
    <MoleculesFormField label="Email address" v-slot="{ id }">
      <AtomsInput :id v-model="email" type="email" name="email" required />
    </MoleculesFormField>
    <div ref="turnstileEl"></div>
    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending"> Create account
    </AtomsButton>
    <p class="o-signup-form__terms | body-xs">
      By creating an account, you agree to our
      <NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink>,
      <NuxtLink to="/acceptable-use">Acceptable Use Policy</NuxtLink>
      and <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.
    </p>
  </MoleculesForm>
</template>

<script setup lang="ts">
/**
 *  Emits
 */
const emits = defineEmits(["form-success", "form-error", "form-clear-error"]);

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
const formErrors = ref<{ title: string; message: string } | null>(null);

onMounted(() => initializeTurnstile());
onUnmounted(() => cleanupTurnstile());

/**
 *  Validate form and submit
 */
async function createAccount({ target }: SubmitEvent) {
  if (isPending.value) return;

  setPendingWhile(async () => {
    // Clear any existing form errors
    formErrors.value = null;

    // Basic validation
    if (!email.value) {
      formErrors.value = {
        title: "Please fill in all fields",
        message: "Email is required.",
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

    await $fetch("/auth/signup", {
      method: "POST",
      body: {
        email: email.value,
        turnstileToken,
      },
    })
      .then((response) => {
        emits("form-success", response);
      })
      .catch((error) => {
        resetTurnstile();
        formErrors.value = {
          title: "Account creation failed",
          message: error.data?.message || "An error occurred",
        };
      });
  });
}
</script>
<style lang="scss" scoped>
.o-signup-form {
  &__terms {
    a {
      text-decoration: underline;
      text-decoration-color: var(--primary-400);
    }
  }
}
</style>
