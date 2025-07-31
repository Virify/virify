export function useInfoModal(onClose?: () => void) {
  const modalPosition = ref<Record<string, any>>({});
  const modalRef = ref<HTMLElement | null>(null);

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    document.body.style.overflow = "";
  }

  function openModal(event: MouseEvent, offsetX = -200, offsetY = 8) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    
    modalPosition.value = {
      position: "fixed",
      top: `${rect.bottom + offsetY}px`,
      left: `${rect.left + offsetX}px`,
      zIndex: 2000,
    };
    
    lockBodyScroll();
    
    // Wait for next tick to set ref and add click listener
    setTimeout(() => {
      modalRef.value = document.querySelector(".info-modal");
      // Add click listener only after modal is open
      document.addEventListener('click', handleDocumentClick);
    }, 0);
  }

  function closeModal() {
    modalPosition.value = {};
    unlockBodyScroll();
    // Remove click listener when modal closes
    document.removeEventListener('click', handleDocumentClick);
  }

  function handleDocumentClick(event: MouseEvent) {
    if (!modalPosition.value.position) return; // No modal open
    const modalEl = modalRef.value;
    if (modalEl && !modalEl.contains(event.target as Node)) {
      if (onClose) onClose();
      closeModal();
    }
  }

  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick);
    unlockBodyScroll();
  });

  return {
    modalPosition,
    openModal,
    closeModal,
  };
}