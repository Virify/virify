import { createSharedComposable } from "@vueuse/core";

/**
 * Cookie Consent Composable
 *
 * Manages GDPR/ePrivacy compliance for analytics tracking:
 * - When ACCEPTED: Full analytics with sessionId (unique visitors, funnels, session tracking)
 * - When DECLINED: Anonymous analytics only (total counts, no session/user tracking)
 * - When NO CHOICE: Banner shows until user makes a decision
 *
 * All tracking happens regardless of choice, but data granularity differs:
 * - Accepted = sessionId sent (can track unique users, paths, funnels)
 * - Declined = sessionId null (only aggregate counts like total views)
 */
/**
 * Cookie Consent Composable
 *
 * Manages GDPR/ePrivacy compliance for analytics tracking:
 * - When ACCEPTED: Full analytics with sessionId (unique visitors, funnels, session tracking)
 * - When DECLINED: Anonymous analytics only (total counts, no session/user tracking)
 * - When NO CHOICE: Banner shows until user makes a decision
 *
 * All tracking happens regardless of choice, but data granularity differs:
 * - Accepted = sessionId sent (can track unique users, paths, funnels)
 * - Declined = sessionId null (only aggregate counts like total views)
 */
export const useCookieConsent = createSharedComposable(() => {
  // State
  const isOpen = ref(false);
  const hasConsented = ref(false);
  const hasInteraction = ref(false); // Whether user has made a choice

  // Initialize from localStorage
  onMounted(() => {
    if (import.meta.client) {
      const storedConsent = localStorage.getItem("virify-cookie-consent");

      if (storedConsent === "true") {
        hasConsented.value = true;
        hasInteraction.value = true;
        isOpen.value = false;
        useGtag().gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "granted",
        });
      } else if (storedConsent === "false") {
        hasConsented.value = false;
        hasInteraction.value = true;
        isOpen.value = false;
      } else {
        // No choice made yet
        isOpen.value = true;
      }
    }
  });

  // Actions
  function acceptCookies() {
    if (import.meta.client) {
      localStorage.setItem("virify-cookie-consent", "true");
      hasConsented.value = true;
      hasInteraction.value = true;
      isOpen.value = false;

      // Grant GA consent
      useGtag().gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  }

  function declineCookies() {
    if (import.meta.client) {
      localStorage.setItem("virify-cookie-consent", "false");
      hasConsented.value = false;
      hasInteraction.value = true;
      isOpen.value = false;

      // Ensure GA consent remains denied
      useGtag().gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  }

  function resetConsent() {
    isOpen.value = true;
  }

  return {
    isOpen,
    hasConsented,
    hasInteraction,
    acceptCookies,
    declineCookies,
    resetConsent,
  };
});
