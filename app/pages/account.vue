<template>
  <div class="container">
    <div v-if="favorites.length > 0">
      <ListingCard :listings="favorites" :title="`Favourite Listings: `" @remove-from-listings="removeFromFavorites" />
    </div>

    <div class="pt-6">

      <div v-if="loggedIn" class="w-full max-w-md">
        <div>
          <h1 class="title-xl">Account</h1>
          <p class="title-xs">Manage your account settings and preferences.</p>
          <p class="body-sm"><strong>ID:</strong> {{ user?.id }}</p>
          <p class="body-sm"><strong>Email: </strong> {{ user?.email }}</p>
          <p class="body-sm"><strong>Username:</strong> {{ user?.username }}</p>
        </div>

        <div class="flex flex-row gap-2">
          <button @click="logout" class="button button-ghost button-sm">Logout</button>
          <button @click="deleteAccount" class="button button-monochrome button-sm">Delete Account</button>
        </div>
      </div>

      <div class="w-full max-w-md pt-6">
        <h2 class="title-xl">Update Password</h2>
        <OrganismsFormsPasswordReset />
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
const { user, session, clear, loggedIn } = useUserSession();
const { getFavourites, removeListingFromArray } = useFavourites();

const favorites = ref<ListingWithFullProperty[]>([]);

onMounted(async () => {
  // Fetch the user's favorites when the component is mounted
  fetchFavorites();
});

/**
 * Fetches the user's favorite listings
 * and updates the favorites state
 */
const fetchFavorites = async () => {
  favorites.value = await getFavourites();
};

/**
 * Remove a listing from favorites
 */
const removeFromFavorites = (listingId: number) => {
  favorites.value = removeListingFromArray(favorites.value, listingId);
};
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