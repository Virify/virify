import { Style } from '../../../.nuxt/components';
<script setup lang="ts">
const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm(
  {
    email: "",
    businessName: "",
    mainContact: "",
    addressLine: "",
    city: "",
    county: "",
    country: "",
    postcode: "",
    registrationNumber: "",
  },
  "agent"
);

/**
 * Signup function
 */
async function signup() {
  await submitForm("/auth/signup", "Signup successful! Approving your account, We will email you once your account is approved...");
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  clearNotification("/agent/login");
}
</script>

<template>
  <div class="flex justify-center items-center bg-purple-500 h-screen">
    <div class="flex justify-center items-center w-1/2 h-full bg-white py-12 xs:w-full sm:w-1/2">
      <div class="p-8 flex justify-center flex-col sm:w-3/4 xs:w-full">
        <h1 class="text-3xl font-bold mb-6 text-purple-500">Agency Signup</h1>
        <h3 class="text-xl font-bold mb-6 text-purple-500">Once you have signed up to Virify, we will verify you and then you can start adding agents to your Agency Account!</h3>
        <FormKit type="form" @submit="signup">
          <FormKit steps-class="border-0 shadow-none px-0" type="multi-step" tab-style="progress">
            <FormKit type="step" name="personal">
              <FormKit type="email" prefix-icon="email" name="email" label="Email" validation="required|email" validation-visibility="dirty" help="Must be your business email address." />
              <FormKit type="text" prefix-icon="text" name="businessName" label="Business Name" validation="required" validation-visibility="dirty" help="Your business name." />
              <FormKit type="tel" prefix-icon="telephone" name="mainContact" label="Main Contact Number" validation="required|phone" validation-visibility="dirty" help="Your main contact number." prefiex-icon="telephone" />
            </FormKit>
            <FormKit type="step" name="address">
              <FormKit type="text" name="addressLine" label="Address Line 1" validation="required" validation-visibility="dirty" />
              <FormKit type="text" name="city" label="City" validation="required" validation-visibility="dirty" />
              <FormKit type="text" name="county" label="County" validation="required" validation-visibility="dirty" />
              <FormKit type="text" name="country" label="Country" validation="required" validation-visibility="dirty" />
              <FormKit type="text" name="postcode" label="Postcode" validation="required|postcodeUK" validation-visibility="dirty" />
            </FormKit>
          </FormKit>
        </FormKit>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-full xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
    <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
  </div>
</template>
<style scoped>
form {
  max-width: 100%;
  border: none !important;
  .group {
    max-width: 100%;
    border: none !important;
    border-width: 0;
    box-shadow: none !important;
    .stepNext {
      button {
        background-color: #6b46c1;
      }
    }
  }
}
</style>
