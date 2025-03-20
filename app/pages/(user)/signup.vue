<script setup lang="ts">
import * as z from "zod";
const { showToast } = useToastNotification();

const schema = z.object({
  email: z.string().email("Email is required").nonempty("Invalid email address"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
});

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
      console.log(error.data);
      showToast({
        title: error.data.message,
        icon: "ri:error-warning-line",
      });
    });
}
</script>

<template>
  <div class="flex justify-center items-center w-full">
    <div class="w-full sm:w-lg">
      <h1 class="text-3xl font-bold mb-6">Signup</h1>
      <p class="mb-6">Signup quickly to Virify to gain access to creating you own listings and much more...</p>
      <!-- UI Form -->
      <UForm @submit="signup" :state="state" :schema="schema" class="w-full">
        <!-- email input -->
        <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2 mb-2">
          <UInput v-model="state.email" type="email" placeholder="JohnDoe@email.com" size="xl" class="w-full" autocomplete="on" />
        </UFormField>
        <!-- password input -->
        <UButton color="primary" type="submit" loading-auto size="xl" class="mt-4" variant="solid" active> Signup </UButton>
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
