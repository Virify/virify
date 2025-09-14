<template>
  <MoleculesForm method="POST" action="/auth/signup" @submit.prevent="createAccount" class="| stacked"
    :error="formErrors">
    <MoleculesFormField label="Email address" v-slot="{ id }">
      <AtomsInput :id v-model="email" type="email" name="email" required />
    </MoleculesFormField>

    <AtomsButton class="| button-full button-monochrome" type="submit" :pending="isPending"> Create account </AtomsButton>
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

/**
 *  Form data
 */
const email = ref('')

/**
 *  Handle errors
 */
const formErrors = ref(null);

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
    await $fetch("/auth/signup", {
      method: "POST",
      body: {
        email: email.value,
      },
    })
      .then((response) => {
        emits("form-success", response);
      })
      .catch((error) => {
        formErrors.value = {
          title: "Account creation failed",
          message: error.data?.message || "An error occurred",
        };
      });
  });
}
</script>
