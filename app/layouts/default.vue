<script setup lang="ts">
const items = ref([
  [
    {
      label: "User",
      icon: "material-symbols:person-pin-circle",
      active: false,
      children: [
        { label: "Signup", icon: "game-icons:archive-register", to: "/signup", active: false },
        { label: "Login", icon: "hugeicons:login-method", to: "/login", active: false },
        { label: "Account", icon: "material-symbols:article-person", to: "/account", active: false },
      ],
    },
    {
      label: "Agent",
      icon: "mdi:home",
      active: false,
      children: [
        { label: "Signup", icon: "game-icons:archive-register", to: "/agent/signup", active: false },
        { label: "Login", icon: "hugeicons:login-method", to: "/agent/login", active: false },
        { label: "Account", icon: "material-symbols:article-person", to: "/agent/account", active: false },
      ],
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
