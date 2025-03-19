<script setup lang="ts">
import * as z from "zod";

const { showToast } = useToastNotification();
const error = useRoute().query.error;

onMounted(() => {
  // if there is an error, set the notification to the error message
  if (error) {
    showToast({
      title: error as string,
      icon: "ri:error-warning-line",
    });
  }
});

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
      showToast({
        title: "Login successful",
        icon: "ri:check-line",
      });
      // redirect to account page
      navigateTo("/account");
    })
    .catch((error: any) => {
      showToast({ title: error.statusMessage, icon: "ri:error-warning-line" });
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
        <UButton color="primary" type="submit" loading-auto size="xl" class="mt-4" variant="solid" active> Login </UButton>
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
