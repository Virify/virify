<template>
  <div
    v-if="isOpen"
    class="fixed bottom-4 left-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300"
  >
    <UCard :ui="{}">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-cookie"
            class="w-5 h-5 text-primary-500"
          />
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Cookie Consent
          </h3>
        </div>
      </template>

      <div class="text-sm text-gray-500 dark:text-gray-400">
        <p class="mb-2">We use cookies and analytics to improve your experience:</p>
        <ul class="list-disc list-inside body-xs mt-2">
          <li><strong>Accept:</strong> Detailed analytics to improve our service</li>
          <li><strong>Decline:</strong> Anonymous statistics only</li>
        </ul>
        <div class="mt-3 body-xs">
          Read our
          <NuxtLink
            to="/cookie"
            class="link"
            >Cookie Policy</NuxtLink
          >,
          <NuxtLink
            to="/privacy"
            class="link"
            >Privacy Policy</NuxtLink
          >
          and
          <NuxtLink
            to="/terms"
            class="link"
            >Terms of Service</NuxtLink
          >.
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between gap-3">
          <!-- Optional: Decline button if you want to offer choice -->

          <UButton
            color="neutral"
            variant="subtle"
            label="Decline"
            size="sm"
            block
            class="body-sm"
            @click="declineCookies"
          />
          <UButton
            color="primary"
            variant="solid"
            label="Accept All"
            size="sm"
            block
            @click="acceptCookies"
            class="text-white! body-sm"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  const { isOpen, acceptCookies, declineCookies } = useCookieConsent();
</script>
