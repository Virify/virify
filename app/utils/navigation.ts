/**
 * Utility functions for navigation and scrolling
 */

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
};

/**
 * Scrolls a container element to the bottom
 * @param element - The HTML element to scroll
 * @param behavior - Scroll behavior ('smooth' | 'instant' | 'auto')
 */
export const scrollToBottom = (element: HTMLElement | null, behavior: ScrollBehavior = 'instant') => {
  if (!element) return;
  
  element.scrollTo({
    top: element.scrollHeight,
    behavior
  });
};