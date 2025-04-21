<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const { fetch } = useUserSession();
const route = useRoute();

const otpSchema = z.object({
  otpCode: z.string().min(6, "OTP code must be at least 6 characters long"),
});

const state = reactive({
  otpCode: "",
});

async function verify(event: FormSubmitEvent<any>) {
  try {
    const response = await $fetch("/auth/verify-otp", {
      method: "POST",
      body: {
        otpCode: state.otpCode,
        token: route.params.token,
      },
    });
    console.log(response.user);
    // need to fetch the auth session on the client side
    await fetch()
    navigateTo(response.redirect);
  } catch (error) {
    console.log(error);
  }
}
</script>
<template>
  <div>
    <h1>Verify your email address with your OTP code sent to your email</h1>
    <UForm @submit="verify" :state="state" :schema="otpSchema" class="w-full pb-10" ref="mainForm">
      <UFormField label="otp" name="otp" size="xl" hint="Required" class="py-2 mb-2">
        <UInput v-model="state.otpCode" type="text" size="xl" class="w-full" />
      </UFormField>
    </UForm>
  </div>
</template>
