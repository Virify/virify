<template>
  <MoleculesForm method="POST" action="/auth/password-reset" @submit.prevent="resetPassword" class="| stacked"
    :error="formErrors">
    <MoleculesFormField label="Email address" v-slot="{ id }">
      <AtomsInput :id type="email" name="email" required />
    </MoleculesFormField>

    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending"> Submit </AtomsButton>
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
const { isPending, setPendingWhile } = usePending();

/**
 *  Handle errors
 */
const formErrors = ref();

/**
 *  Validate form and submit
 */
async function resetPassword({ target }: SubmitEvent) {
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
    await $fetch("/auth/password-reset", {
      method: "POST",
      body: {
        email: formData?.get("email"),
      },
    })
      .then(({ passwordToken }) => {
        emits("form-success", passwordToken);
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
