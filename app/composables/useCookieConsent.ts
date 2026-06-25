import { createSharedComposable } from "@vueuse/core";

type GoogleConsentStatus = "granted" | "denied";

const GOOGLE_CONSENT_FIELDS = [
  "analytics_storage",
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
] as const;

function updateGoogleAnalyticsConsent(status: GoogleConsentStatus) {
  if (!import.meta.client) return;

  try {
    const { consent } = useScriptGoogleAnalytics();

    consent?.update(
      Object.fromEntries(GOOGLE_CONSENT_FIELDS.map((field) => [field, status])),
    );
  } catch (error) {
    console.warn("[analytics] Failed to update Google Analytics consent", error);
  }
}

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
        updateGoogleAnalyticsConsent("granted");
      } else if (storedConsent === "false") {
        hasConsented.value = false;
        hasInteraction.value = true;
        isOpen.value = false;
        updateGoogleAnalyticsConsent("denied");
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
      updateGoogleAnalyticsConsent("granted");
    }
  }

  function declineCookies() {
    if (import.meta.client) {
      localStorage.setItem("virify-cookie-consent", "false");
      hasConsented.value = false;
      hasInteraction.value = true;
      isOpen.value = false;

      // Ensure GA consent remains denied
      updateGoogleAnalyticsConsent("denied");
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
