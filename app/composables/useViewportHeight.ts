import { onMounted, onUnmounted } from 'vue';

export const useViewportHeight = () => {
  const setViewportHeight = () => {
    if (import.meta.client) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  };

  onMounted(() => {
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', setViewportHeight);
    window.removeEventListener('orientationchange', setViewportHeight);
  });
};
