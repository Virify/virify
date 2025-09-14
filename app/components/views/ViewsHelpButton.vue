<template>
  <button
    class="help-button"
    @click="openSupportDialog"
    aria-label="Get help"
  >
    <AtomsIcon icon="account/chat" class="help-button__icon" />
  </button>
</template>

<script setup>
const { showDialog } = useDialog()

function openSupportDialog() {
  showDialog({
    component: resolveComponent('ViewsDialogSupport'),
    className: 'dialog-support',
  })
}
</script>

<style lang="scss" scoped>
.help-button {
  position: fixed;
  bottom: var(--size-32);
  right: var(--size-32);
  z-index: 1000;
  width: var(--size-56);
  height: var(--size-56);
  border-radius: 50%;
  background: var(--secondary-500);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    background: var(--secondary-500);
  }

  &:active {
    transform: translateY(0);
  }
}

.help-button__icon {
  color: var(--monochrome-900);
  width: var(--size-24);
  height: var(--size-24);
}

@media (max-width: 768px) {
  .help-button {
    bottom: var(--size-16);
    right: var(--size-16);
    width: var(--size-48);
    height: var(--size-48);
  }

  .help-button__icon {
    width: var(--size-20);
    height: var(--size-20);
  }
}
</style>