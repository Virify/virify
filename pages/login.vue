<script setup lang="ts">
const router = useRouter();
definePageMeta({
  middleware: ['login']
});
const form = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: null as string | null,
  password: null as string | null
});

const notification = ref<string | null>(null);

function validateForm() {
  let isValid = true;
  if (!form.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else {
    errors.value.email = null;
  }
  if (!form.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else {
    errors.value.password = null;
  }
  return isValid;
}

async function handleLogin() {
  if (validateForm()) {
    // Simulate an API call
    const res = await new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-1/3">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form @submit.prevent="handleLogin">
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
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
        </div>
      </form>
      <a href="/auth/google" class="py-3 block">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4">Login with Google</button>
      </a>
      <a href="/auth/microsoft" class="py-3 block">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4">Login with Microsoft</button>
      </a>
    </div>
    <div v-if="notification" class="fixed bottom-0 right-0 m-4 p-4 bg-green-500 text-white rounded" :class="{ 'bg-red-500': notification.includes('failed') }">
      {{ notification }}
    </div>
  </div>
</template>