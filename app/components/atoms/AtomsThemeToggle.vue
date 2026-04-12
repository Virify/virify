<template>
  <button
    type="button"
    class="a-theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <svg
      class="a-theme-toggle__icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- Sun icon (visible in dark mode) -->
      <g v-if="isDark" class="a-theme-toggle__sun">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
      <!-- Moon icon (visible in light mode) -->
      <path v-else class="a-theme-toggle__moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark({
  onChanged(isDark) {
    if (import.meta.server) return
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<style lang="scss">
.a-theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &__icon {
    display: block;
    transition: transform 0.3s ease;
  }

  &__sun,
  &__moon {
    transform-origin: center;
    animation: fadeIn 0.3s ease;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-20deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

// Dark mode specific styles
html.dark .a-theme-toggle {
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
