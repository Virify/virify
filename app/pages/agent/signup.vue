<script setup lang="ts">
const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm({
  email: "",
  businessName: "",
  mainContact: "",
  addressLine: "",
  city: "",
  county: "",
  country: "",
  postcode: "",
  registrationNumber: "",
}, 'agent');

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
        <form @submit.prevent="signup">
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="email">Agent Email:
              <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">This *must* be your business email</span>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="businessName">Agent Name:
              <span v-if="errors.businessName" class="text-red-400 text-xs italic">{{ errors.businessName }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Your Agent operating name</span>
            <input v-model="form.businessName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="businessName" type="text" placeholder="Business Name" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="mainContact">Agent Main Contact:
              <span v-if="errors.mainContact" class="text-red-400 text-xs italic">{{ errors.mainContact }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">The main contact number for this Agency</span>
            <input v-model="form.mainContact" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="mainContact" type="text" placeholder="Main Contact" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="addressLine">Business Address:
              <span v-if="errors.addressLine" class="text-red-400 text-xs italic">{{ errors.addressLine }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Address Line 1</span>
            <input v-model="form.addressLine" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="businessAddress" type="text" placeholder="Address Line 1" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="city">City:
              <span v-if="errors.city" class="text-red-400 text-xs italic">{{ errors.city }}</span>
            </label>
            <input v-model="form.city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="City" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="county">County:
              <span v-if="errors.county" class="text-red-400 text-xs italic">{{ errors.county }}</span>
            </label>
            <input v-model="form.county" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="county" type="text" placeholder="County" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="country">Country:
              <span v-if="errors.country" class="text-red-400 text-xs italic">{{ errors.country }}</span>
            </label>
            <input v-model="form.country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="postcode">Postcode:
              <span v-if="errors.postcode" class="text-red-400 text-xs italic">{{ errors.postcode }}</span>
            </label>
            <input v-model="form.postcode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="postcode" type="text" placeholder="Postcode" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold mb-2" for="registrationNumber">Company Registration Number:
              <span v-if="errors.registrationNumber" class="text-red-400 text-xs italic">{{ errors.registrationNumber }}</span>
            </label>
            <input v-model="form.registrationNumber" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="registrationNumber" type="text" placeholder="Registration Number" />
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-purple-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Loading...</span>
              <span v-else>Signup</span>
            </button>
            <NuxtLink to="/agent/login" class="bg-white text-purple-500 font-bold py-3 px-4 rounded border border-purple-500 focus:outline-none focus:shadow-outline" type="submit">Login</NuxtLink>
          </div>
        </form>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-full xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
    <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
  </div>
</template>