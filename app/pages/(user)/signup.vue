<script setup lang="ts">
import * as z from "zod";
const { showToast } = useToastNotification();

/**
 * Form validation schema
 */
const schema = z.object({
  email: z.string().email("Email is required").nonempty("Invalid email address"),
});

type Schema = z.output<typeof schema>;

  /**
   * Form state
   */
const state = reactive<Partial<Schema>>({
  email: "",
});

/**
 * Signup function
 * Note the role is hardcoded to user
 * This is because the signup page is only for users
 */
async function signup() {
  await $fetch("/auth/signup", {
    method: "POST",
    body: {
      email: state.email,
      role: "user",
    },
  })
    .then(() => {
      showToast({
        title: "Signup successful! Please check your inbox for an activation email.",
        icon: "ri:check-line",
      });
      // redirect to login page
      navigateTo("/login");
    })
    .catch((error) => {
      console.log(error)
      console.log(error.data)
      console.log(error.statusMessage)
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
      <h1 class="text-3xl font-bold mb-6">Signup</h1>
      <p class="mb-6">Signup quickly to Virify to gain access to creating you own listings and much more...</p>
      <!-- UI Form -->
      <UForm @submit="signup" :state="state" :schema="schema" class="w-full">
        <!-- email input -->
        <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2 mb-2">
          <UInput v-model="state.email" type="email" placeholder="JohnDoe@email.com" size="xl" class="w-full" autocomplete="on" />
        </UFormField>
        <!-- submit button -->
        <UButton color="primary" type="submit" loading-auto size="xl" class="mt-4" variant="solid" active> Signup </UButton>
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
