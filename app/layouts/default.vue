<script setup lang="ts">
const route = useRoute();

const items = ref([
  [
    {
      label: "User",
      icon: "i-lucide-book-open",
      active: false,
      children: [
        { label: "Signup", icon: "i-lucide-book-open", to: "/signup", active: false },
        { label: "Login", icon: "i-lucide-book-open", to: "/login", active: false },
        { label: "Account", icon: "i-lucide-book-open", to: "/account", active: false },
      ],
    },
    {
      label: "Agent",
      icon: "i-lucide-database",
      active: false,
      children: [
        { label: "Signup", icon: "i-lucide-database", to: "/agent/signup", active: false },
        { label: "Login", icon: "i-lucide-database", to: "/agent/login", active: false },
        { label: "Account", icon: "i-lucide-database", to: "/agent/account", active: false },
      ],
    },
  ],
]);

/**
 * Update the active state of the items based on the current route
 * This function will be called whenever the route changes
 * and will update the active state of the items accordingly
 */
function updateActiveState() {
  items.value.forEach((group) => {
    group.forEach((item) => {
      item.active = item.children.some((child) => {
        child.active = child.to === route.path;
        return child.active;
      });
    });
  });
}

// Keep it reactive by watching the route
watch(() => route.path, updateActiveState, { immediate: true });
</script>

<template>
  <header>
    <UContainer>
      <UNavigationMenu color="primary" highlight highlight-color="primary" :items="items" content-orientation="vertical" class="w-full" />
    </UContainer>
  </header>
  <NuxtPage />
</template>
