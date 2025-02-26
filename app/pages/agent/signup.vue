<script setup lang="ts">

const router = useRouter();

const form = ref({
  email: "",
  password: "",
  agentName: "",
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
  agentName: null as string | null,
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

  if (!form.value.password) {
    errors.value.password = "Password is required";
    isValid = false;
  } else {
    errors.value.password = null;
  }

  if (!form.value.agentName) {
    errors.value.agentName = "Agent Name is required";
    isValid = false;
  } else {
    errors.value.agentName = null;
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
          password: form.value.password,
          agentName: form.value.agentName,
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
  <div class="flex justify-center items-center h-screen bg-purple-500 h-screen">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs: w-full sm:w-1/2">
      <div class="p-8 xs: w-full sm:w-1/2 h-1/2 flex justify-center flex-col">
        <h1 class="text-3xl font-bold mb-6 text-purple-500">Agency Signup</h1>
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
            <label class="block text-purple-500 text-sm font-bold" for="password"
              >Agent Password:
              <span v-if="errors.password" class="text-red-400 text-xs italic">{{ errors.password }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">This is required to manage your Agency</span>
            <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="agentName"
              >Agent Name:
              <span v-if="errors.agentName" class="text-red-400 text-xs italic">{{ errors.agentName }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Your Agent operating name</span>
            <input v-model="form.agentName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="agentName" type="text" placeholder="Agent Name" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="mainContact"
              >Agent Main Contact:
              <span v-if="errors.mainContact" class="text-red-400 text-xs italic">{{ errors.mainContact }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">The main contact for this Agency</span>
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
            <label class="block text-purple-500 text-sm font-bold" for="city"
              >Business Address:
              <span v-if="errors.city" class="text-red-400 text-xs italic">{{ errors.city }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">City</span>
            <input v-model="form.city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="City" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="county"
              >Business Address:
              <span v-if="errors.county" class="text-red-400 text-xs italic">{{ errors.county }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">County</span>
            <input v-model="form.county" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="county" type="text" placeholder="County" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="country"
              >Business Address:
              <span v-if="errors.country" class="text-red-400 text-xs italic">{{ errors.country }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Country</span>
            <input v-model="form.country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" />
          </div>
          <div class="mb-6">
            <label class="block text-purple-500 text-sm font-bold" for="postcode"
              >Business Address:
              <span v-if="errors.postcode" class="text-red-400 text-xs italic">{{ errors.postcode }}</span>
            </label>
            <span class="block text-purple-500 text-xs font-xs mb-2">Postcode</span>
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
    <div class="flex flex-col justify-center items-center w-1/2 bg-purple-500 h-screen xs: hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-5xl italic p-4 text-center">For Agents</h2>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>