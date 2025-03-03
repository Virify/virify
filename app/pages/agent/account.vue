<script setup lang="ts">

definePageMeta({
  middleware: "auth-redirect",
});

// composable imports
const { user, loggedIn, session, clear } = useUserSession();

// refs
const notification = ref<string | null>(null);
const showDeleteConfirmation = ref(false);

/**
 * Logs out the user and redirects to the login page
 */
async function logout() {
  await clear();
  navigateTo("/agent/login");
}

/**
 * Deletes the user account
 * Redirects to the home page after successful deletion
 * Shows an error notification if deletion fails
 * Shows a success notification if deletion is successful
 */
async function deleteAccount() {
  try {
    await $fetch("/auth/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    notification.value = "Account deleted successfully! Redirecting to home page...";
    await clear();
    navigateTo("/");
  } catch (error) {
    notification.value = (error as any)?.statusMessage || "An error occurred.";
  }
}

/**
 * Logs the user in
 */
function login() {
  navigateTo("/agent/login");
}

/**
 * Clears the notification
 */
function clearNotificationHandler() {
  notification.value = null;
}

/**
 * Opens the delete confirmation modal
 */
function openDeleteConfirmation() {
  showDeleteConfirmation.value = true;
}

/**
 * Closes the delete confirmation modal
 */
function closeDeleteConfirmation() {
  showDeleteConfirmation.value = false;
}

/**
 * Confirms the deletion of the account
 */
async function confirmDeleteAccount() {
  closeDeleteConfirmation();
  await deleteAccount();
}
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-center items-center h-screen bg-gray-100">
    <div class="flex justify-center items-center w-full sm:w-1/2 bg-white h-full sm:h-screen">
      <div v-if="loggedIn" class="w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="sm:text-3xl font-bold mb-6 text-purple-500 xs:text-lg break-words">Welcome {{ user?.email }}!</h1>
        <p class="text-gray-600 mb-4 break-words">Logged in since {{ session.loggedInAt }}</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button @click="logout" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
          <button @click="openDeleteConfirmation" class="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Delete Account</button>
        </div>
        <div v-if="notification" class="text-red-600 pt-6 break-words">{{ notification }}</div>
      </div>
      <div v-else class="text-center w-3/4 p-8 xs:w-full sm:w-3/4">
        <h1 class="text-3xl font-bold text-purple-500 mb-4 break-words">You are not logged in!</h1>
        <p class="text-gray-600 mb-4 break-words">Please log in to access your account.</p>
        <button @click="login" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-full sm:w-1/2 bg-purple-500 h-1/2 sm:h-screen">
      <h1 class="text-white font-bold text-8xl break-words">Virify</h1>
      <h2 class="text-white text-4xl p-4 text-center break-words">Your awesome property people!</h2>
    </div>
    <Modal v-if="notification" :message="notification" @clear="clearNotificationHandler" />
    <Modal v-if="showDeleteConfirmation" @clear="closeDeleteConfirmation">
      <template #default>
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">Confirm Account Deletion</h2>
          <p class="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
          <div class="flex justify-end gap-4">
            <button @click="closeDeleteConfirmation" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">No</button>
            <button @click="confirmDeleteAccount" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Yes</button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>