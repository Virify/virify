<script setup lang="ts">
const form = ref({
  email: "",
  password: "",
  username: "",
});

const errors = ref({
  email: null as string | null,
  username: null as string | null,
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
  if (!form.value.username) {
    errors.value.username = "Username is required";
    isValid = false;
  } else {
    errors.value.username = null;
  }
  if (!form.value.password) {
    errors.value.password = "Password is required";
    isValid = false;
  } else {
    errors.value.password = null;
  }
  return isValid;
}

async function signup() {
  if (validateForm()) {
    try {
      const response: { status: number } = await $fetch("/auth/signup", {
        method: "POST",
        body: {
          email: form.value.email,
          username: form.value.username,
          password: form.value.password,
        },
      });
      useUserSession().fetch();
      if (response.status === 201) {
        notification.value = "Signup successful!";
        setTimeout(() => {
          notification.value = null;
          navigateTo("/login");
        }, 2000);
      } else {
        notification.value = "Signup failed!";
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
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-1/3">
      <h1 class="text-2xl font-bold mb-4">Signup</h1>
      <form @submit.prevent="signup">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          <span v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
          <input v-model="form.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          <span v-if="errors.username" class="text-red-500 text-xs italic">{{ errors.username }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          <span v-if="errors.password" class="text-red-500 text-xs italic">{{ errors.password }}</span>
        </div>
        <div class="flex items-center justify-between">
          <button to="/signup" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Signup</button>
        </div>
      </form>
    </div>
    <div v-if="notification" class="fixed bottom-0 right-0 m-4 p-4 bg-green-500 text-white rounded" :class="{ 'bg-red-500': notification.includes('failed') }">
      {{ notification }}
    </div>
  </div>
</template>
