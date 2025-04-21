<script setup lang="ts">
import * as z from "zod";
const { showToast } = useToastNotification();

const emailSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

type Schema = z.output<typeof emailSchema>;

const state = reactive<Partial<Schema>>({
  email: "",
});

async function submit() {
  await $fetch("/auth/email-password-reset", {
    method: "POST",
    body: {
      email: state.email,
    },
  })
    .then(() => {
      showToast({
        title: "Check your inbox for the password reset link",
        icon: "ri:check-line",
      });
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
  <div class="flex justify-center items-center w-full">
    <div class="w-full sm:w-lg p-8">
      <h1 class="text-3xl font-bold mb-6">Password Reset</h1>
      <p class="text-md mb-4">If you have an account with us, we will send you a one time code to verify your email before creating a new password!</p>
      <!-- UI Form -->
      <UForm @submit="submit" :state="state" :schema="emailSchema" class="w-full">
        <!-- email input -->
        <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2">
          <UInput v-model="state.email" type="email" placeholder="Enter your email" size="xl" class="w-full" autocomplete="on" />
        </UFormField>
        <div class="flex justify-between items-base mt-4">
          <UButton color="primary" type="submit" loading-auto size="xl" variant="solid" active> Submit </UButton>
        </div>
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
