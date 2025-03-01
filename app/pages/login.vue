<script setup lang="ts">
const { loggedIn, fetch } = useUserSession();
const route = useRoute();

definePageMeta({
  title: "Login",
  description: "Login to your account",
  middleware: "login",
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

onMounted(() => {
  if (loggedIn.value) {
    notification.value = "Already logged in! Redirecting to account page...";
    setTimeout(() => {
      notification.value = null;
      navigateTo("/account");
    }, 2000);
  }
  if (route.query.login === "success") {
    notification.value = "Logged in successfully! Redirecting to account page...";
    setTimeout(() => {
      notification.value = null;
      navigateTo("/account");
    }, 2000);
  } else if (route.query.error === "agent") {
    notification.value = "Error: Agent login required";
    setTimeout(() => {
      notification.value = null;
    }, 2000);
  }
});

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
      const response: { status: number; body?: any } = await $fetch("/auth/owner/login", {
        method: "POST",
        body: {
          email: form.value.email,
          password: form.value.password,
        },
      });

      if (response.status === 200) {
        await fetch();
        notification.value = "Logged in successfully! Redirecting to account page...";
        setTimeout(() => {
          notification.value = null;
          navigateTo("/account");
        }, 2000);
      } else if (response.body.details.includes("Forbidden")) {
        notification.value = "Error: Agent login required";
        setTimeout(() => {
          notification.value = null;
        }, 3000);
      } else if (response.body.error) {
        notification.value = "Error: " + response.body.details;
        setTimeout(() => {
          notification.value = null;
        }, 2000);
      }
    } catch (error) {
      notification.value = (error as any).message;
      setTimeout(() => {
        notification.value = null;
      }, 2000);
    }
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Login</h1>
        <form @submit.prevent="login">
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="email">
              Email:
              <span v-if="errors.email" class="text-red-400 text-xs italic">{{ errors.email }}</span>
            </label>
            <input v-model="form.email" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
          </div>
          <div class="mb-6">
            <label class="block text-green-500 text-sm font-bold mb-2" for="password">
              Password:
              <span v-if="errors.password" class="text-red-400 text-xs italic">{{ errors.password }}</span>
            </label>
            <input v-model="form.password" class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          </div>
          <div class="flex items-center justify-between gap-3 mt-4 w-full flex-wrap">
            <div class="flex items-center justify-start gap-3 flex-wrap">
              <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
            </div>
            <div class="flex items-center justify-end gap-3 flex-wrap">
              <NuxtLink to="/signup" class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Signup</NuxtLink>
            </div>
          </div>
        </form>
        <div class="flex items-center justify-start gap-3 mt-4"></div>
      </div>
      <div v-if="notification" class="fixed bottom-80 left-50 m-4 p-6 bg-green-500 text-white text-center rounded font-bold max-w-xs w-full" :class="{ 'bg-red-500': notification.includes('Error') }">
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
