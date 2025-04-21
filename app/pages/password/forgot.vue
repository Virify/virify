<script setup lang="ts">
const { showToast } = useToastNotification();

/**
 *  Form state
 */
const formPending = ref(false)

/**
 *  Form errors
 */
const { query } = useRoute()

const formErrorTitle = ref(false)
const formErrorContent = ref(false)

/**
 * Signup function
 *
 * The users role is set here on user creation.
 * This is an important step determining if the user is an agent or a normal user and has knock on effects.
 */
async function resetPassword({ target }) {
  if (formPending.value) return

  // Clear any existing form errors
  formErrorTitle.value = null
  formErrorContent.value = null

  // First check the validity of the form
  const { validity, errors } = useFormValidationMessage(target)

  // If errors exist, show them
  if (!validity) {
    formErrorTitle.value = "Your form contains errors - please ensure all fields are correctly filled out"
    formErrorContent.value = errors

    return
  }

  // Construct a form object
  const formData = new FormData(target)

  try {
    const user = await $fetch<SignupResponse>("/auth/password-reset", {
      method: "POST",
      body: {
        email: formData.get('email'),
      },
    });

    console.log(user);

    // redirect to OTP verification for password reset
    navigateTo("/verify?passwordToken=" + user.passwordToken);
  } catch (error) {
    formErrorTitle.value = 'An error occured'
    formErrorContent.value = error?.data?.message
  }
}
</script>
<template>
  <div class="| container container-2xs flow flow-lg">
    <h1 class="| title-xl">Reset password</h1>

    <p class="| body-sm">Forgot your password? Don't worry - it happens to us all. Just enter your email address below
      and we will send you a one-time password to initiate a password reset</p>

    <MoleculesErrorBox v-if="formErrorTitle" :error-title="formErrorTitle" :error-content="formErrorContent" />

    <MoleculesForm method="POST" action="/auth/password-reset" @submit.prevent="resetPassword"
      class="p-login-form | stacked">
      <AtomsInput label="Email address" type="email" name="email" required />

      <AtomsButton class="p-login-form-submit | button-full button-monochrome" type="submit" :pending="formPending">
        Submit
      </AtomsButton>
    </MoleculesForm>

    <AtomsDivider text="or" />

    <div class="| center-text flow flow-sm">
      <p class="| body-sm">
        Already know your password?
        <nuxt-link to="/login">Log in now</nuxt-link>
      </p>

      <p class="| body-sm">
        Don't have an account yet?
        <nuxt-link to="/signup">Create an account</nuxt-link>
      </p>
    </div>

  </div>
</template>
