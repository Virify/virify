<script setup lang="ts">
const route = useRoute();

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
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

/**
 * Update the active state of the items based on the current route
 * This function will be called whenever the route changes
 * and will update the active state of the items accordingly
 */
// function updateActiveState() {
//   items.value.forEach((group) => {
//     group.forEach((item) => {
//       item.active = item.children.some((child) => {
//         child.active = child.to === route.path;
//         return child.active;
//       });
//     });
//   });
// }

// Keep it reactive by watching the route
// watch(() => route.path, updateActiveState, { immediate: true });
</script>

<template>
  <header>
    <UContainer>
      <UNavigationMenu color="primary" :items="items" content-orientation="vertical" class="w-full p-2">
        <template #mode>
          <UButton :icon="isDark ? 'ri:moon-line' : 'ri:sun-line'" variant="link" color="primary" @click="isDark = !isDark" />
        </template>
      </UNavigationMenu>
    </UContainer>
  </header>
  <NuxtPage />
</template>
