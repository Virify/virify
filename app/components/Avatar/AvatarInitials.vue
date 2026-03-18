<template>
  <div role="img" class="avatar-initials">
    {{ initials || 'V' }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: 'Virify'
})

const initials = computed(() => {
  const { name } = props

  return name
    // Split the seller name into words only
    .split(/[^a-z]/gi)
    // Remove any blank entries
    .filter(Boolean)
    // Get first 2 words (or fewer)
    .slice(0, 2)
    // Get first character of each word
    .map(([word]: string) => word)
    // Join together as a new word
    .join('')
})
</script>

<style lang="scss">
:where(.avatar-initials) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0;
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  border-radius: var(--border-radius-ui);
  background: light-dark(var(--blue-400), var(--blue-100));
  color: var(--monochrome-900);
  width: 4ch;
  height: 4ch;
}
</style>