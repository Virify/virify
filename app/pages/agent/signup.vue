<script setup lang="ts">

const form = ref({
  email: "",
  businessName: "",
  mainContact: "",
  addressLine: "",
  city: "",
  county: "",
  country: "",
  postcode: "",
  registrationNumber: "",
});

const errors = ref({
  email: null as string | null,
  password: null as string | null,
  businessName: null as string | null,
  mainContact: null as string | null,
  addressLine: null as string | null,
  city: null as string | null,
  county: null as string | null,
  country: null as string | null,
  postcode: null as string | null,
  registrationNumber: null as string | null,
});

const notification = ref<string | null>(null);

function validateForm() {
  let isValid = true;

  if (!form.value.email) {
    errors.value.email = "Email is required";
    isValid = false;
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = "Invalid email format";
    isValid = false;
  } else {
    errors.value.email = null;
  }

  if (!form.value.businessName) {
    errors.value.businessName = "Business Name is required";
    isValid = false;
  } else {
    errors.value.businessName = null;
  }

  if (!form.value.mainContact) {
    errors.value.mainContact = "Main Contact is required";
    isValid = false;
  } else {
    errors.value.mainContact = null;
  }

  if (!form.value.addressLine) {
    errors.value.addressLine = "Address Line is required";
    isValid = false;
  } else {
    errors.value.addressLine = null;
  }

  if (!form.value.city) {
    errors.value.city = "City is required";
    isValid = false;
  } else {
    errors.value.city = null;
  }

  if (!form.value.county) {
    errors.value.county = "County is required";
    isValid = false;
  } else {
    errors.value.county = null;
  }

  if (!form.value.country) {
    errors.value.country = "Country is required";
    isValid = false;
  } else {
    errors.value.country = null;
  }

  if (!form.value.postcode) {
    errors.value.postcode = "Postcode is required";
    isValid = false;
  } else {
    errors.value.postcode = null;
  }

  if (!form.value.registrationNumber) {
    errors.value.registrationNumber = "Registration Number is required";
    isValid = false;
  } else {
    errors.value.registrationNumber = null;
  }

  return isValid;
}
async function signup() {
  if (validateForm()) {
    try {
      const response: { status: number, body: any } = await $fetch("/auth/agent/signup", {
        method: "POST",
        body: {
          email: form.value.email,
          businessName: form.value.businessName,
          mainContact: form.value.mainContact,
          addressLine: form.value.addressLine,
          city: form.value.city,
          county: form.value.county,
          country: form.value.country,
          postcode: form.value.postcode,
          registrationNumber: form.value.registrationNumber,
        },
      });
      useUserSession().fetch();
      if (response.status === 201) {
        notification.value = "Signup successful!";
        setTimeout(() => {
          notification.value = null;
          navigateTo("/agent/review");
        }, 2000);
      } else {
        notification.value = response.body.error;
        setTimeout(() => {
          notification.value = null;
        }, 3000);
      }
    } catch (error) {
      notification.value = "Signup failed!";
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-center bg-purple-500 h-screen">
    <div class="flex justify-center items-center w-1/2 h-full bg-white py-12 xs: w-full sm:w-1/2">
      <div class="p-8 flex justify-center flex-col sm:w-3/4 xs:w-full">
        <h1 class="text-3xl font-bold mb-6 text-purple-500">Agency Signup</h1>
        <h3 class="text-xl font-bold mb-6 text-purple-500">Once you have signed up to Virify, we will verify you and then you can start adding agents to your Agency Account!</h3>
        <form @submit.prevent="signup">
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="email"
              >Agent Email:
              <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">This *must* be your business email</span>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="businessName"
              >Agent Name:
              <span v-if="errors.businessName" class="text-red-400 text-xs italic">{{ errors.businessName }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Your Agent operating name</span>
            <input v-model="form.businessName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="businessName" type="text" placeholder="Business Name" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="mainContact"
              >Agent Main Contact:
              <span v-if="errors.mainContact" class="text-red-400 text-xs italic">{{ errors.mainContact }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">The main contact number for this Agency</span>
            <input v-model="form.mainContact" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="mainContact" type="text" placeholder="Main Contact" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="addressLine"
              >Business Address:
              <span v-if="errors.addressLine" class="text-red-400 text-xs italic">{{ errors.addressLine }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Address Line 1</span>
            <input v-model="form.addressLine" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="businessAddress" type="text" placeholder="Address Line 1" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-xs font-xs mb-2" for="city"
              >City:
              <span v-if="errors.city" class="text-red-400 text-xs italic">{{ errors.city }}</span>
            </label>
            <input v-model="form.city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="City" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="county"
              >County:
              <span v-if="errors.county" class="text-red-400 text-xs italic">{{ errors.county }}</span>
            </label>
            <input v-model="form.county" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="county" type="text" placeholder="County" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="country"
              >Country:
              <span v-if="errors.country" class="text-red-400 text-xs italic">{{ errors.country }}</span>
            </label>
            <input v-model="form.country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="postcode"
              >Postcode:
              <span v-if="errors.postcode" class="text-red-400 text-xs italic">{{ errors.postcode }}</span>
            </label>
            <input v-model="form.postcode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="postcode" type="text" placeholder="Postcode" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold mb-2" for="registrationNumber"
              >Company Registration Number:
              <span v-if="errors.registrationNumber" class="text-red-400 text-xs italic">{{ errors.registrationNumber }}</span>
            </label>
            <input v-model="form.registrationNumber" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="registrationNumber" type="text" placeholder="Registration Number" />
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-purple-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Signup</button>
            <NuxtLink to="/agent/login" class="bg-white text-purple-500 font-bold py-3 px-4 rounded border border-purple-500 focus:outline-none focus:shadow-outline" type="submit">Login</NuxtLink>
          </div>
        </form>
      </div>
      <div v-if="notification" class="fixed bottom-0 left-0 m-4 p-6 bg-purple-500 text-white rounded font-bold" :class="{ 'bg-red-500': notification.includes('Failed') }">
        {{ notification }}
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-full xs: hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
  </div>
</template>