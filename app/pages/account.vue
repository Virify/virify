<script setup lang="ts">
definePageMeta({
  middleware: "auth-redirect",
});

const { user, session, clear } = useUserSession();
const { showToast } = useToastNotification();

/**
 * Logs out the user and redirects to the login page
 */
async function logout() {
  await clear();
  navigateTo("/login");
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
      showToast({
        title: "Account deleted successfully! Redirecting to home page...",
        icon: "ri:check-line",
      });
      navigateTo("/");
    })
    .catch((error) => {
      showToast({
        title: error.data.message,
        icon: "ri:error-warning-line",
      });
    });
}
</script>

<template>
  <div class="flex justify-center items-center w-full p-4 sm:p-0">
    <div class="w-full sm:w-lg">
      <h1 class="text-3xl font-bold mb-6">Account</h1>
      <p class="mb-6">Manage your account settings and preferences.</p>
      <p class="mb-6">Logged in since {{ session.loggedInAt }}</p>
      <p class="mb-6">User ID: {{ user?.id }}</p>
      <p class="mb-6">User Email: {{ user?.email }}</p>
      <p class="mb-6">User Email: {{ user?.role}}</p>
      <div class="w-full sm:w-lg">
        <!-- UI Form -->
        <UButton @click="logout" class="mb-4 mr-2" variant="solid">Logout</UButton>
        <UButton @click="deleteAccount" class="mb-4" variant="solid">Delete Account</UButton>
      </div>
    </div>
  </div>
</template>
