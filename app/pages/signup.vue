<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
const { showToast } = useToastNotification();

/**
 * Form validation schema
 */
const schema = z.object({
  email: z.string().email("Email Address Required").nonempty("Invalid email address"),
});

type Schema = z.output<typeof schema>;

/**
 * Form state
 */
const state = reactive<Partial<Schema>>({
  email: "",
});

/**
 * Disable button if there are errors or if the stepper has a next step
 * Forces user to fill out the form before moving to the next step
 */
function submitState() {
  const isEmailValid = !schema.safeParse(state).error;
  return !isEmailValid;
}

/**
 * Signup function
 *
 * The users role is set here on user creation.
 * This is an important step determining if the user is an agent or a normal user and has knock on effects.
 */
async function signup(event: FormSubmitEvent<any>) {
  interface SignupResponse {
    userID: string;
    email: string;
    token: string;
    otpCode: string;
  }
  try {
    const user = await $fetch<SignupResponse>("/auth/signup", {
      method: "POST",
      body: {
        ...state,
      },
    });
    console.log(user);
    // redirect to OTP Verification for activation
    navigateTo("/verify?token=" + user.token);
  } catch (error) {
    showToast({
      title: (error as { data: { message: string } }).data.message,
      icon: "ri:error-warning-line",
    });
  }
}
</script>

<template>
  <div class="flex justify-center items-center w-full p-4 sm:p-0">
    <div class="w-full sm:w-lg">
      <!-- pre form content -->
      <h1 class="text-3xl font-bold mb-6">Signup</h1>
      <p class="mb-6">Signup quickly to Virify to gain access to creating you own listings and much more...</p>
      <!-- UI Form -->
      <UForm @submit="signup" :state="state" :schema="schema" class="w-full pb-10" ref="mainForm">
        <!-- email input -->
        <UFormField label="Email" name="email" size="xl" hint="Required" class="py-2 mb-2">
          <UInput v-model="state.email" type="email" placeholder="JohnDoe@email.com" size="xl" class="w-full" autocomplete="on" />
        </UFormField>
        <!-- Submit button -->
        <div class="w-full sm:w-md">
          <UButton type="submit" loading-auto size="xl" class="mt-8 px-4" variant="solid" :disabled="submitState()"> Submit </UButton>
        </div>
        <!-- END submit button -->
      </UForm>
      <!-- END UI Form -->
    </div>
  </div>
</template>
