<script setup lang="ts">
const items = ref([
  [
    {
      label: "Signup",
      icon: "mdi:register",
      active: false,
      to: "/signup",
    },
    {
      label: "Login",
      icon: "mdi:user-edit",
      active: false,
      to: "/login",
    },
    {
      label: "Account",
      icon: "mdi:account",
      active: false,
      to: "/account",
    },
  ],
  [
    {
      label: "mode",
      icon: "i-lucide-circle-help",
      slot: "mode",
    },
  ],
]);

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <OrganismsHeader />
    <header>
      <UContainer>
        <UNavigationMenu color="primary" :items="items" content-orientation="vertical" class="w-full p-2 z-2 h-auto">
          <template #mode>
            <ClientOnly>
              <UButton :icon="isDark ? 'ri:moon-line' : 'ri:sun-line'" variant="link" color="primary" @click="isDark = !isDark" />
            </ClientOnly>
          </template>
        </UNavigationMenu>
      </UContainer>
    </header>
    <main class="flex flex-grow w-full">
      <NuxtPage />
    </main>
  </div>
</template>
