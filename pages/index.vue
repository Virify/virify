<script setup lang="ts">
const route = useRoute();

onMounted(() => {
  if (route.query.error) {
    notification.value = "Not authorized to access that page!";
    setTimeout(() => {
      notification.value = null;
    }, 3000);
  }
});

interface Form {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

const form = ref<Form>({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  postcode: "",
  country: "",
});

const errors = ref<Record<keyof Form, string | null>>({
  firstName: null,
  lastName: null,
  username: null,
  email: null,
  password: null,
  addressLine1: null,
  addressLine2: null,
  city: null,
  county: null,
  postcode: null,
  country: null,
});

const notification = ref<string | null>(null);

function validateForm() {
  let isValid = true;
  Object.keys(form.value).forEach((key) => {
    if (!(form.value as any)[key]) {
      (errors.value as any)[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      isValid = false;
    } else {
      errors.value[key as keyof Form] = "";
    }
  });
  return isValid;
}

function resetForm() {
  form.value = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: "",
    country: "",
  };
  errors.value = {
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    password: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    county: null,
    postcode: null,
    country: null,
  };
}
async function handleForm() {
  if (validateForm()) {
    const res: Response = await $fetch("/api/user/create", {
      method: "POST",
      body: form.value,
    });
    if (res.status === 201) {
      notification.value = "User created successfully!";
      setTimeout(() => {
        notification.value = null;
      }, 3000);
      resetForm();
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 w-1/4">
      <h1 class="text-2xl font-bold mb-4">Test User Creation Form</h1>
      <form @submit.prevent>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName"> First Name </label>
          <input v-model="form.firstName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name" />
          <span v-if="errors.firstName" class="text-red-500 text-xs italic">{{ errors.firstName }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName"> Last Name </label>
          <input v-model="form.lastName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName" type="text" placeholder="Last Name" />
          <span v-if="errors.lastName" class="text-red-500 text-xs italic">{{ errors.lastName }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username"> Username </label>
          <input v-model="form.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          <span v-if="errors.username" class="text-red-500 text-xs italic">{{ errors.username }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"> Email </label>
          <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          <span v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
          <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          <span v-if="errors.password" class="text-red-500 text-xs italic">{{ errors.password }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="addressLine1"> Address Line 1 </label>
          <input v-model="form.addressLine1" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="addressLine1" type="text" placeholder="Address Line 1" />
          <span v-if="errors.addressLine1" class="text-red-500 text-xs italic">{{ errors.addressLine1 }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="addressLine2"> Address Line 2 </label>
          <input v-model="form.addressLine2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="addressLine2" type="text" placeholder="Address Line 2" />
          <span v-if="errors.addressLine2" class="text-red-500 text-xs italic">{{ errors.addressLine2 }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="city"> City </label>
          <input v-model="form.city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="City" />
          <span v-if="errors.city" class="text-red-500 text-xs italic">{{ errors.city }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="county"> County </label>
          <input v-model="form.county" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="county" type="text" placeholder="County" />
          <span v-if="errors.county" class="text-red-500 text-xs italic">{{ errors.county }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="postcode"> Postcode </label>
          <input v-model="form.postcode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="postcode" type="text" placeholder="Postcode" />
          <span v-if="errors.postcode" class="text-red-500 text-xs italic">{{ errors.postcode }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="country"> Country </label>
          <input v-model="form.country" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" />
          <span v-if="errors.country" class="text-red-500 text-xs italic">{{ errors.country }}</span>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" @click="handleForm">Create User</button>
        </div>
      </form>
      <a href="/auth/google" class="py-3 block">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login with Google</button>
      </a>
    </div>
    <div v-if="notification" class="fixed bottom-0 right-0 m-4 p-4 bg-green-500 text-white rounded" :class="{ 'bg-red-500': notification.includes('Not authorized') }">
      {{ notification }}
    </div>
  </div>
</template>
