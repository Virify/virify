<script setup lang="ts">

const notification = ref<string | null>(null);

async function sendEmail() {
  try {
    const response: { status: number; body?: any } = await $fetch("/email/send-email", {
      method: "POST",
      query: {
        to: "jamie@virify.co.uk",
        subject: "Test email",
        content: "This is a test email",
      },
    });
    if (response.status === 200) {
      console.log("Email sent successfully");
    } else {
      console.error("Failed to send email");
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div>
    <h1>Test validateEmail</h1>
    <button @click="sendEmail">Send Email</button>
  </div>
</template>