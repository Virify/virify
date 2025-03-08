<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
// composable imports
const { form, errors, notification, isLoading, submitForm, clearNotification } = useAuthForm({ email: "", password: "" }, "user");

// check for errors from query
const error = useRoute().query.error;

// if there is an error, set the notification to the error message
if (error) notification.value = error as string;

const schema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
})
/**
 * Login function
 */
async function login(event: FormSubmitEvent<Schema>) {
  await submitForm("/auth/login", "Login successful! Redirecting to account page...");
}

/**
 * Clear notification handler
 */
function clearNotificationHandler() {
  clearNotification("/account");
}
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-1/2 bg-white h-screen xs:w-full sm:w-1/2">
      <div class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold mb-6 text-green-500">Login</h1>
        <!-- UI Form -->
        <UForm @submit="login" :state="state" :schema="schema" class="w-full">
          <!-- email input -->
          <UFormField label="Email" name="email" size="xl">
            <UInput v-model="state.email" type="email" placeholder="Email" size="xl" class="w-full"/>
          </UFormField>
          <!-- password input -->
          <UFormField label="Password" name="password" size="xl">
            <UInput v-model="state.password" type="password" placeholder="Pasword" size="xl" class="w-full" />
          </UFormField>
          <UButton type="submit" loading-auto size="xl" class="text-white mt-4" variant="solid" active> Login </UButton>
        </UForm>
        <!-- END UI Form -->
        <!-- <form @submit.prevent="login">
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
          <div class="flex items-center justify-start gap-4">
            <UButton type="submit" loading-auto size="xl" class="text-white" variant="solid" active> Login </UButton>
            <NuxtLink to="/signup" class="bg-white text-green-500 font-bold py-3 px-4 rounded border border-green-500 focus:outline-none focus:shadow-outline" type="submit">Signup</NuxtLink>
          </div>
        </form> -->
      </div>
      <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
    </div>
    <div class="flex flex-col justify-center items-center w-1/2 bg-green-500 h-screen xs:hidden sm:flex">
      <h1 class="text-white font-bold text-8xl">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center">Your awesome property people!</h2>
    </div>
  </div>
</template>
