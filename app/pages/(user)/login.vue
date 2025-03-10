<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const toast = useToast();
const notification = ref("");
const error = useRoute().query.error;

// if there is an error, set the notification to the error message
if (error) {
  toast.clear();
  toast.add({
    title: error as string,
  });
};

// validation schema
const schema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
});

/**
 * Global Toast
 */
function showToast() {
  toast.add({
    title: notification.value,
    icon: "ri:error-warning-line",
  });
  toast.clear();
}

/**
 * Login function
 */
async function login() {
  await $fetch("/auth/login", {
    method: "POST",
    body: {
      email: state.email,
      password: state.password,
      role: "user",
    },
  })
    .then(() => {
      notification.value = "Login successful! Redirecting to account page...";
      // redirect to account page
      navigateTo("/account");
    })
    .catch((error) => {
      notification.value = error.statusMessage;
      showToast();
    });
}
</script>

<template>
  <div class="flex justify-center items-center h-screen flex-col sm:flex-row">
    <div class="flex justify-center items-center w-full bg-white h-screen">
      <div class="p-8 w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Login</h1>
        <!-- UI Form -->
        <UForm @submit="login" :state="state" :schema="schema" class="w-full">
          <!-- email input -->
          <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2">
            <UInput v-model="state.email" type="email" placeholder="Enter your email" size="xl" class="w-full" autocomplete="on"/>
          </UFormField>
          <!-- password input -->
          <UFormField label="Password" name="password" size="xl" hint="Required" class="py-2">
            <UInput v-model="state.password" type="password" placeholder="Enter your password" size="xl" class="w-full" />
          </UFormField>
          <UButton type="submit" loading-auto size="xl" class="text-white mt-4" variant="solid" active> Login </UButton>
        </UForm>
        <!-- END UI Form -->
      </div>
    </div>
    <div class="flex-col justify-center items-center w-full bg-green-500 h-screen hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>
