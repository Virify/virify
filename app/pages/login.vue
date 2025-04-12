<script setup lang="ts">
import * as z from "zod";
const { showToast } = useToastNotification();
const { fetch } = useUserSession();
const route = useRoute();
/**
 * Check for errors from query
 * If there is an error, set the notification to the error message
 * This is used to show a notification if the user is not logged in
 */
watch(
  () => route.query.error,
  (newError) => {
    if (newError) {
      showToast({
        title: "Please login to access your account.",
        icon: "ri:error-warning-line",
      });
      navigateTo(route.path, { replace: true }); // Removes query params
    }
  }
);

/**
 * Form validation schema
 */
const schema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
});

/**
 * Login function
 * Note the role is hardcoded to user
 * This is because the login page is only for users
 */
async function login() {
  await $fetch("/auth/login", {
    method: "POST",
    body: {
      email: state.email,
      password: state.password,
    },
  })
    .then(() => {
      showToast({
        title: "Login successful",
        icon: "ri:check-line",
      });
      // we have set the userSession in the backend, we need the client to fetch the user session
      fetch();
      // redirect to account page
      navigateTo("/account");
    })
    /**
     * Strangely enough, on the client you can only access statusMessage via data.message
     * This is ONLY in production deployed - might be a Netlify issue
     * In development, you can access statusMessage directly
     */
    .catch((error: any) => {
      showToast({ title: error.data.message, icon: "ri:error-warning-line" });
    });
}
</script>

<template>
  <div class="flex justify-center items-center w-full">
    <div class="w-full sm:w-lg p-8">
      <h1 class="text-3xl font-bold mb-6">Login</h1>
      <!-- UI Form -->
      <UForm @submit="login" :state="state" :schema="schema" class="w-full">
        <!-- email input -->
        <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2">
          <UInput v-model="state.email" type="email" placeholder="Enter your email" size="xl" class="w-full" autocomplete="on" />
        </UFormField>
        <!-- password input -->
        <UFormField label="Password" name="password" size="xl" hint="Required" class="py-2">
          <UInput v-model="state.password" type="password" placeholder="Enter your password" size="xl" class="w-full" />
        </UFormField>
        <div class="flex justify-between items-base mt-4">
        <UButton color="primary" type="submit" loading-auto size="xl" variant="solid" active> Login </UButton>
        <NuxtLink to="/password/forgot" class="text-sm">Forgot Password?</NuxtLink>
        </div>
        
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
