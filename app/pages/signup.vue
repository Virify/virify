<script setup lang="ts">
const form = ref({
  email: "",
});

const errors = ref({
  email: null as string | null,
});

const notification = ref<string | null>(null);
const isLoading = ref(false);

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
  return isValid;
}

async function signup() {
  if (validateForm()) {
    isLoading.value = true;
    try {
      const response: { status: number, body: any } = await $fetch("/auth/user/signup", {
        method: "POST",
        body: {
          email: form.value.email,
        },
      });
      if (response.status === 200) {
        notification.value = "Signup successful! Please check your email for an activation link";
        setTimeout(() => {
          navigateTo("/login");
          notification.value = null;
        }, 2000);
      } else {
        notification.value = response.body.error;
        setTimeout(() => {
          notification.value = null;
        }, 3000);
      }
    } catch (error) {
      notification.value = "Signup failed";
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Signup</h1>
        <form @submit.prevent="signup">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="email"
              >Email:
              <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
            </label>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Loading...</span>
              <span v-else>Signup</span>
            </button>
            <NuxtLink to="/login" class="bg-white text-green-500 font-bold py-3 px-4 rounded border border-green-500 focus:outline-none focus:shadow-outline" type="submit">Login</NuxtLink>
          </div>
        </form>
      </div>
      <div v-if="notification" class="fixed bottom-80 left-50 m-4 p-6 bg-green-500 text-white rounded font-bold" :class="{ 'bg-red-500': notification.includes('failed') }">
        {{ notification }}
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>