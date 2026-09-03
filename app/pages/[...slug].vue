<script setup lang="ts">
// Every route other than the homepage is retired — send visitors to the splash page.
await navigateTo("/", { redirectCode: 302, replace: true });
</script>

<template>
  <SplashScreen />
</template>
