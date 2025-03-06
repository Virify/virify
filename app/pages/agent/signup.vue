<script setup lang="ts">
const notification = ref<string | null>(null);

/**
 * Login function
 */
async function signup(signup: any) {
  try {
    await $fetch("/auth/signup", {
      method: "POST",
      body: {
        ...signup,
        role: "agent",
      },
    });
    notification.value = "Signup Successful";
  } catch (error: any) {
    notification.value = error.data.statusMessage;
  }
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  notification.value = null;
}
</script>

<template>
  <div class="flex justify-center items-center bg-green-500 h-screen">
    <div class="flex justify-center items-center w-1/2 h-full bg-white py-12 xs:w-full sm:w-1/2">
      <div class="p-8 flex justify-center flex-col sm:w-3/4 xs:w-full">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Agency Signup</h1>
        <h3 class="text-xl font-bold mb-6 text-green-500">Once you have signed up to Virify, we will verify you and then you can start adding agents to your Agency Account!</h3>
        <FormKit type="form" @submit="signup" #default="{ value }">
          <FormKit type="multi-step" tab-style="progress">
            <FormKit type="step" name="personal">
              <FormKit label-class="text-green-500" type="email" prefix-icon="email" name="email" label="Email" validation="required|email" validation-visibility="dirty" help="Must be your business email address." />
              <FormKit type="tel" prefix-icon="telephone" name="mainContact" label="Main Contact Number" validation="required|phone" validation-visibility="dirty" help="Your main contact number." prefiex-icon="telephone" />
            </FormKit>
            <FormKit type="step" name="company">
              <FormKit type="text" prefix-icon="text" name="businessName" label="Business Name" validation="required" validation-visibility="dirty" help="Your business name." />
              <FormKit type="number" prefix-icon="number" name="registrationNumber" label="Company Registration Number" validation="required" validation-visibility="dirty" help="Your company registration number." />
            </FormKit>
            <FormKit type="step" name="address">
              <FormKit type="text" prefix-icon="text" name="addressLine" label="Address Line 1" validation="required" validation-visibility="dirty" help="First line of business address." />
              <FormKit type="text" prefix-icon="text" name="city" label="City" validation="required" validation-visibility="dirty" help="City of business." />
              <FormKit type="text" prefix-icon="text" name="county" label="County" validation="required" validation-visibility="dirty" help="County of business." />
              <FormKit type="text" prefix-icon="text" name="country" label="Country" validation="required" validation-visibility="dirty" help="Country of business." />
              <FormKit type="text" prefix-icon="text" name="postcode" label="Postcode" validation="required|postcodeUK" validation-visibility="dirty" help="Postcode of business." />
            </FormKit>
          </FormKit>
        </FormKit>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-full xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
    <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
  </div>
</template>
<style scoped></style>
