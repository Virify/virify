<template>
  <UBadge
    v-if="isVerified"
    icon="i-lucide-shield-check"
    color="success"
    variant="subtle"
    size="md"
  >
    Verified
  </UBadge>
</template>

<script setup lang="ts">
  const props = defineProps<{
    verification?: {
      name?: boolean | null;
      identity?: boolean | null;
      role?: string | null;
    } | null;
  }>();

  const isVerified = computed(() => {
    const v = props.verification;
    if (!v) return false;
    if (v.role === "ADMIN" || v.role === "AGENT") return true;
    return v.name === true && v.identity === true;
  });
</script>
