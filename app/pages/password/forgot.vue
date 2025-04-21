<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

interface SignupResponse {
  userID: string;
  email: string;
  passwordToken: string;
  otpCode: string;
}

const { showToast } = useToastNotification();

const emailSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

type Schema = z.output<typeof emailSchema>;

const state = reactive<Partial<Schema>>({
  email: "",
});

/**
 * Signup function
 *
 * The users role is set here on user creation.
 * This is an important step determining if the user is an agent or a normal user and has knock on effects.
 */
async function reset(event: FormSubmitEvent<any>) {
  try {
    const user = await $fetch<SignupResponse>("/auth/password-reset", {
      method: "POST",
      body: {
        ...state,
      },
    });
    console.log(user);
    // redirect to OTP verification for password reset
    navigateTo("/verify?passwordToken=" + user.passwordToken);
  } catch (error) {
    showToast({
      title: (error as { data: { message: string } }).data.message,
      icon: "ri:error-warning-line",
    });
  }
}
</script>
<template>
  <div class="flex justify-center items-center w-full">
    <div class="w-full sm:w-lg p-8">
      <h1 class="text-3xl font-bold mb-6">Password Reset</h1>
      <p class="text-md mb-4">If you have an account with us, we will send you a one time code to verify your email before creating a new password!</p>
      <!-- UI Form -->
      <UForm @submit="reset" :state="state" :schema="emailSchema" class="w-full">
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
