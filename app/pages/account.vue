<template>
  <div class="container">
    <div v-if="favourites.length > 0">
      <ListingCards :listings="favourites" :title="`Favourite Listings: `" />
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
const { user, clear, loggedIn } = useUserSession();
const favourites = useState<ListingCardType[]>("favourites");
const { getAllFavourites } = useFavourites();

onMounted(() => {
    getAllFavourites();
});

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