<template>
  <MoleculesForm
    method="POST"
    action="/auth/login"
    @submit.prevent="loginUser"
    class="| stacked"
    :error="formErrors"
  >
    <MoleculesFormField
      label="Email address"
      v-slot="{ id }"
    >
      <AtomsInput
        :id
        v-model="email"
        type="email"
        name="email"
        required
      />
    </MoleculesFormField>

    <MoleculesFormPassword
      label="Password"
      v-model="password"
      type="password"
      name="password"
      required
      minlength="8"
    />

    <label class="o-login-form__remember | body-sm">
      <input
        type="checkbox"
        v-model="rememberMe"
        name="rememberMe"
        class="o-login-form__remember-checkbox"
      />
      <span class="body-sm">Remember me for 7 days</span>
    </label>

    <div ref="turnstileEl"></div>
    <AtomsButton
      class="| button-full button-monochrome"
      type="submit"
      :pending="isPending"
    >
      Log in
    </AtomsButton>
  </MoleculesForm>
</template>

<script setup lang="ts">
  /**
   *  Emits
   */
  const emits = defineEmits(["form-success"]);

  /**
   *  Composables
   */
  const { pattern, validityText } = getValidPassword();
  const { isPending, setPendingWhile } = usePending();
  const {
    turnstileEl,
    initializeTurnstile,
    executeTurnstile,
    resetTurnstile,
    cleanupTurnstile,
  } = useTurnstile();

  /**
   *  Form data
   */
  const email = ref("");
  const password = ref("");
  const rememberMe = ref(false);

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
          title: "Please fill in all fields",
          message: "Email and password are required.",
        };
        return;
      }

      if (password.value.length < 8) {
        return;
      }

      // Post data
      let turnstileToken: string;
      try {
        turnstileToken = await executeTurnstile();
      } catch {
        formErrors.value = {
          title: "Bot verification failed",
          message: "Unable to complete bot verification. Please refresh and try again.",
        };
        return;
      }

      await $fetch("/auth/login", {
        method: "POST",
        body: {
          email: email.value,
          password: password.value,
          rememberMe: rememberMe.value,
          turnstileToken,
        },
      })
        .then(() => {
          // Notify other open tabs to refresh their session
          try {
            new BroadcastChannel("virify:auth").postMessage({ type: "login" });
          } catch {}
          emits("form-success");
        })
        .catch((error) => {
          resetTurnstile();
          formErrors.value = {
            title: "Login failed",
            message: error.data.message,
          };
        });
    });
  }
</script>

<style lang="scss">
  .o-login-form__remember {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--size-8);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-decoration-color: var(--primary-400);
    }

    &-checkbox {
      width: var(--size-16);
      height: var(--size-16);
      cursor: pointer;
      flex-shrink: 0;
    }
  }
</style>
