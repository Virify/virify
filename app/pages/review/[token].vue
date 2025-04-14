<script setup lang="ts">
import * as z from "zod";
const { showToast } = useToastNotification();
const route = useRoute();

const reviewSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  approve: z.enum(["true", "false"]),
  token: z.string().nonempty("Token is required"),
});

// get email and approval from query
const email = route.query.email;
const approve = route.query.approve;
const token = route.params.token;

/**
 * Check if the account is not activated
 * On page mount if the account is activated, show an error notification
 * If the account is not activated, do nothing and let the user activate the account
 */
onMounted(async () => {
  try {
    const validatedData = reviewSchema.parse({
      email: email,
      approve: approve,
      token: token,
    });
    await $fetch("/auth/review-account", {
      method: "POST",
      body: validatedData,
    });
    showToast({
      title: "Account review successful, You can now close this page.",
      icon: "ri:check-line",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message).join(", ");
      showToast({
        title: errorMessages,
        icon: "ri:error-warning-line",
      });
    } else {
      showToast({
        title: error?.data?.message || "Something went wrong",
        icon: "ri:error-warning-line",
      });
    }
  }
});
</script>

<template>
  <div class="flex justify-center items-center w-full p-4 sm:p-0">
    <div class="w-full sm:w-lg">
      <h1 v-if="approve === 'true'" class="text-3xl font-bold mb-6">Thank You!</h1>
      <h3 v-if="approve === 'true'" class="text-xl font-bold mb-6">The agent is now active.</h3>
      <h3 v-else-if="approve === 'false'" class="text-xl font-bold mb-6">The agent has been denied.</h3>
      <p v-if="approve === 'true'" class="mb-6">The agent is now active and can start using the platform. You can now close this page.</p>
      <p v-else-if="approve === 'false'" class="mb-6">The agent has been denied and cannot use the platform. You can now close this page.</p>
    </div>
  </div>
</template>
