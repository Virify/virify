<template>
  <button type="button" role="switch" :aria-checked="isToggled" aria-required="false" @click.prevent="updateToggled"
    class="a-switcher" :class="{
      'a-switcher--active': isToggled
    }">
    <span class="a-switcher__thumb"></span>
  </button>
</template>

<script setup>
const isToggled = defineModel()

function updateToggled() {
  isToggled.value = !isToggled.value
}
</script>

<style lang="scss">
.a-switcher {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--size-28);
  height: var(--size-24);
  padding: 0 var(--size-4);
  margin: 0;
  border-radius: var(--border-radius-pill);
  box-sizing: content-box;
  cursor: pointer;
  background: light-dark(var(--monochrome-800), var(--monochrome-200));
  border: 1px solid light-dark(var(--monochrome-700), var(--monochrome-300));
  transition: border-color var(--animation-fast);

  &:hover {
    background: light-dark(var(--monochrome-800), var(--monochrome-200));
    border: 1px solid light-dark(var(--monochrome-600), var(--monochrome-400));
  }

  &__thumb {
    display: block;
    width: var(--size-16);
    height: var(--size-16);
    background: var(--monochrome-500);
    border-radius: var(--border-radius-pill);
    transition: background-color var(--animation-fast), transform var(--animation-slow);
  }

  &:hover &__thumb {
    background: var(--monochrome-400);
  }

  &--active &__thumb {
    background: var(--secondary-400);
    transform: translateX(var(--size-12));
  }

  &--active:hover &__thumb {
    background: var(--secondary-500);
  }
}
</style>