/**
 * Utility functions for navigation and scrolling
 */

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
};