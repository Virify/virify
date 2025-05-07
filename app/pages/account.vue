<template>
  <div class="container">

    <div v-if="favorites.length > 0" class="mb-6">
      <FeaturedListings :listings="favorites" :title="`Favourite Listings: `" />
    </div>

    <div class="w-full sm:w-lg">
      <h1 class="text-3xl font-bold mb-6">Account</h1>
      <div v-if="loggedIn">
        <p class="mb-6">Manage your account settings and preferences.</p>
        <p class="mb-6">Logged in since {{ session?.loggedInAt }}</p>
        <p class="mb-6">User ID: {{ user?.id }}</p>
        <p class="mb-6">User Email: {{ user?.email }}</p>

        <!-- UI Form -->
        <UForm @submit="setPassword" :state="state" :schema="passwordSchema" class="w-full mb-6">
          <!-- password input -->
          <UFormField label="Password" name="password" size="xl" hint="Required" class="py-2">
            <UInput v-model="state.password" type="password" placeholder="Enter your password" size="xl"
              class="w-full" />
          </UFormField>
          <!-- password input -->
          <UFormField label="Confirm Password" name="confirmedPassword" size="xl" hint="Required" class="py-2">
            <UInput v-model="state.confirmedPassword" type="password" placeholder="Enter your password again" size="xl"
              class="w-full" />
          </UFormField>
          <!-- submit button -->
          <UButton color="primary" type="submit" loading-auto size="xl" class="mt-4" variant="solid" active> Set
            Password </UButton>
        </UForm>
        <!-- END UI Form -->

        <div class="w-full sm:w-lg">
          <!-- UI Form -->
          <UButton @click="logout" class="mb-4 mr-2" variant="solid">Logout</UButton>
          <UButton @click="deleteAccount" class="mb-4" variant="solid">Delete Account</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
const { user, session, clear, loggedIn } = useUserSession();

const favorites = ref<ListingWithFullProperty[]>([]);

onMounted(() => {
  // Fetch the user's favorites when the component is mounted
  fetchFavorites();
});

async function fetchFavorites() {
  // Fetch the user's favorites from the API
  await $fetch("/api/favourite/get-favourites", {
    method: "GET",
  })
    .then((data: any) => {
      console.log("Fetched favorites data:", data.listings);
      favorites.value = data.listings;
      console.log("Fetched favorites:", favorites.value);
    })
    .catch((error) => {
      // console.error("Error fetching favorites:", error);
    });
}

/**
 * Form validation schema
 */
const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
    confirmedPassword: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

type Schema = z.output<typeof passwordSchema>;

/**
 * Form state
 */
const state = reactive<Partial<Schema & { userId: number }>>({
  password: "",
  confirmedPassword: "",
});


/**
 * Reset password function
 * Resets the password and redirects to the login page
 * Shows an error notification if reset fails
 * Shows a success notification if reset is successful
 */
async function setPassword() {
  // validate the token
  await $fetch("/auth/update-password", {
    method: "POST",
    body: {
      password: state.password,
      confirmedPassword: state.confirmedPassword,
    },
  })
    .then(() => {
      console.log("Password reset successfully!");
      state.password = "";
      state.confirmedPassword = "";
    })
    .catch((error) => {
      console.error("Error resetting password:", error);
    });
}

/**
 * Deletes the user account
 * Redirects to the home page after successful deletion
 * Shows an error notification if deletion fails
 * Shows a success notification if deletion is successful
 */
async function deleteAccount() {
  await $fetch("/auth/delete", {
    method: "DELETE",
  })
    .then(() => {
      clear();
      navigateTo("/");
    })
    .catch((error) => {
      console.error("Error deleting account:", error);
    });
}

/**
 * Logs out the user and redirects to the login page
 */
async function logout() {
  await clear();
  navigateTo("/");
}
</script>