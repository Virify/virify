<script setup lang="ts">
definePageMeta({
  middleware: ["login"],
});

const form = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: null as string | null,
  password: null as string | null,
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
  return isValid;
}

async function login() {
  if (validateForm()) {
    try {
      const response: { status: number; body: any } = await $fetch("/auth/login", {
        method: "POST",
        body: {
          email: form.value.email,
          password: form.value.password,
        },
      });

      if (response.status === 200) {
        useUserSession().fetch();
        notification.value = "Login successful!";
        setTimeout(() => {
          notification.value = null;
          navigateTo("/account");
        }, 2000);
      }
      if (response.body.error === "Password is incorrect") {
        notification.value = "Incorrect Password!";
        setTimeout(() => {
          notification.value = null;
        }, 2000);
      }
      if (response.status === 401) {
        notification.value = response.body.error;
        setTimeout(() => {
          notification.value = null;
        }, 2000);
      }
    } catch (error) {
      notification.value = "Login failed!";
      setTimeout(() => {
        notification.value = null;
      }, 2000);
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-1/3">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          <span v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          <span v-if="errors.password" class="text-red-500 text-xs italic">{{ errors.password }}</span>
        </div>
        <div class="flex items-center justify-start gap-3">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4" type="submit">Login</button>
          <NuxtLink external to="/auth/google" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Login with Google</NuxtLink>
          <NuxtLink external to="/auth/microsoft" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Login with Microsoft</NuxtLink>
        </div>
      </form>
      <div class="flex items-center justify-start gap-3">
        <NuxtLink to="/signup" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Signup</NuxtLink>
      </div>
    </div>
    <div v-if="notification" class="fixed bottom-0 right-0 m-4 p-4 bg-green-500 text-white rounded" :class="{ 'bg-red-500': notification.includes('Failed') }">
      {{ notification }}
    </div>
  </div>
</template>
