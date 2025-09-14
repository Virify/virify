<template>
  <MoleculesForm method="POST" action="/auth/password-reset" @submit.prevent="resetPassword" class="| stacked"
    :error="formErrors">
    <MoleculesFormField label="Email address" v-slot="{ id }">
      <AtomsInput :id v-model="email" type="email" name="email" required />
    </MoleculesFormField>

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

/**
 *  Form data
 */
const email = ref('')

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

    // Basic validation
    if (!email.value) {
      formErrors.value = {
        title: 'Please fill in all fields',
        message: 'Email is required.',
      };
      return;
    }

    // Post data
    await $fetch('/auth/password-reset', {
      method: 'POST',
      body: {
        email: email.value,
      },
    })
      .then(({ passwordToken }) => {
        emits('form-success', passwordToken);
      })
      .catch((error) => {
        formErrors.value = {
          title: 'Password reset failed',
          message: error.data.message,
        };
      });
  });
}
</script>
