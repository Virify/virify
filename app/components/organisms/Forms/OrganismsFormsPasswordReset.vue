<template>
  <MoleculesForm method="POST" action="/auth/update-password" @submit.prevent="resetPassword" class="| stacked" :error="formErrors">
    <MoleculesFormPassword label="Password" name="password" required minlength="8" v-model="password" :pattern :custom-validation="validityText"/>

    <MoleculesFormPassword label="Confirm Password" name="confirm" required minlength="8" :confirm-against="password" :pattern :custom-validation="{ patternMismatch: 'Passwords must match' }" v-model="confirm" />

    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending"> Submit </AtomsButton>
  </MoleculesForm>
</template>

<script setup>
/**
 * props
 */
const props = defineProps({
  token: {
    type: String,
  },
});

const password = ref("");
const confirm = ref("");

/**
 *  Emits
 */
const emits = defineEmits(["form-success"]);

/**
 *  Composables
 */
const { pattern, validityText } = getValidPassword();
const { isPending, setPendingWhile } = usePending();

/**
 *  Handle errors
 */
const formErrors = ref(null);

/**
 *  Validate form and submit
 */
async function resetPassword({ target }) {
  if (isPending.value) return;

  setPendingWhile(async () => {
    // Clear any existing form errors
    formErrors.value = null;

    // First check the validity of the form
    const { formData, errors } = useFormData(target);

    // If errors exist, show them
    if (errors) {
      formErrors.value = errors;

      return;
    }

    // Post data
    await $fetch("/auth/update-password", {
      method: "POST",
      body: {
        password: formData.get("password"),
        passwordToken: props.token,
      },
    })
      .then(() => {
        emits("form-success");
      })
      .catch((error) => {
        formErrors.value = {
          title: "Password reset failed",
          message: error.data.message,
        };
      });
  });
}
</script>
