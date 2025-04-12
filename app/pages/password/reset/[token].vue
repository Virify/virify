<script setup lang="ts">
definePageMeta({
  // TODO: Error handing for middleware
  middleware: ["check-password-token"],
});

import * as z from "zod";
const { showToast } = useToastNotification();
const route = useRoute();
const token = route.params.token;

// schema specifying the token
const tokenSchema = z.object({
  token: z.string().nonempty("Token is required"),
});

/**
 * Form validation schema
 */
const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
    confirmedPassword: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

type Schema = z.output<typeof schema>;

/**
 * Form state
 */
const state = reactive<Partial<Schema>>({
  password: "",
  confirmedPassword: "",
});

/**
 * Reset password function
 * Resets the password and redirects to the login page
 * Shows an error notification if reset fails
 * Shows a success notification if reset is successful
 */
async function submit() {
  // validate the token
  const validToken = tokenSchema.parse({
    token: token,
  });
  await $fetch("/auth/password-reset", {
    method: "POST",
    body: {
      password: state.password,
      token: validToken,
    },
  })
    .then(() => {
      showToast({
        title: "Password reset succesfully! Redirecting to login page...",
        icon: "ri:check-line",
      });
      // redirect to login page
      navigateTo("/login");
    })
    .catch((error) => {
      showToast({
        title: error.data.message,
        icon: "ri:error-warning-line",
      });
    });
}
</script>
<template>
  <div class="flex justify-center items-center w-full p-4 sm:p-0">
    <div class="w-full sm:w-lg">
      <!-- pre form content -->
      <h1 class="text-3xl font-bold mb-6">Reset Your Password</h1>
      <p class="mb-6">Please enter and confirm a new password.</p>
      <!-- UI Form -->
      <UForm @submit="submit" :state="state" :schema="schema" class="w-full">
        <!-- password input -->
        <UFormField label="Password" name="password" size="xl" hint="Required" class="py-2">
          <UInput v-model="state.password" type="password" placeholder="Enter your password" size="xl" class="w-full" />
        </UFormField>
        <!-- password input -->
        <UFormField label="Confirm Password" name="confirmedPassword" size="xl" hint="Required" class="py-2">
          <UInput v-model="state.confirmedPassword" type="password" placeholder="Enter your password again" size="xl" class="w-full" />
        </UFormField>
        <!-- submit button -->
        <UButton color="primary" type="submit" loading-auto size="xl" class="mt-4" variant="solid" active> Reset </UButton>
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
