import { createSharedComposable } from "@vueuse/core";

type GoogleConsentStatus = "granted" | "denied";
type StoredCookieConsent = "true" | "false" | null;

const CONSENT_STORAGE_KEY = "virify-cookie-consent";

const GRANTED_CONSENT = {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
} as const;

const DENIED_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

function updateGoogleAnalyticsConsent(status: GoogleConsentStatus) {
  if (!import.meta.client) return;

  try {
    const { consent } = useScriptGoogleAnalytics();
    consent?.update(status === "granted" ? GRANTED_CONSENT : DENIED_CONSENT);
  } catch (error) {
    console.warn("[analytics] Failed to update Google Analytics consent", error);
  }
}

// Exported internal version specifically for isolation in unit tests
export const _useCookieConsentInternal = () => {
  const hasLoadedStoredConsent = ref(false);
  const hasConsented = ref(false);
  const hasInteraction = ref(false);
  const isOpen = computed(() => hasLoadedStoredConsent.value && !hasInteraction.value);

  function readStoredConsent(): StoredCookieConsent {
    if (!import.meta.client) return null;

    try {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      return storedConsent === "true" || storedConsent === "false" ? storedConsent : null;
    } catch (error) {
      console.warn("[analytics] Failed to read cookie consent", error);
      return null;
    }
  }

  function writeStoredConsent(value: Exclude<StoredCookieConsent, null>) {
    if (!import.meta.client) return;

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch (error) {
      console.warn("[analytics] Failed to store cookie consent", error);
    }
  }

  function clearStoredConsent() {
    if (!import.meta.client) return;

    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch (error) {
      console.warn("[analytics] Failed to reset cookie consent", error);
    }
  }

  onMounted(() => {
    if (import.meta.client) {
      const storedConsent = readStoredConsent();

      if (storedConsent === "true") {
        hasConsented.value = true;
        hasInteraction.value = true;
        updateGoogleAnalyticsConsent("granted");
      } else if (storedConsent === "false") {
        hasConsented.value = false;
        hasInteraction.value = true;
        updateGoogleAnalyticsConsent("denied");
      } else {
        hasConsented.value = false;
        hasInteraction.value = false;
        updateGoogleAnalyticsConsent("denied");
      }

      hasLoadedStoredConsent.value = true;
    }
  });

  function acceptCookies() {
    if (import.meta.client) {
      writeStoredConsent("true");
      hasConsented.value = true;
      hasInteraction.value = true;
      updateGoogleAnalyticsConsent("granted");
    }
  }

  function declineCookies() {
    if (import.meta.client) {
      writeStoredConsent("false");
      hasConsented.value = false;
      hasInteraction.value = true;
      updateGoogleAnalyticsConsent("denied");
    }
  }

  function resetConsent() {
    clearStoredConsent();
    hasConsented.value = false;
    hasInteraction.value = false;
    hasLoadedStoredConsent.value = true;
    updateGoogleAnalyticsConsent("denied");
  }

  return {
    isOpen: readonly(isOpen),
    hasConsented: readonly(hasConsented),
    hasInteraction: readonly(hasInteraction),
    acceptCookies,
    declineCookies,
    resetConsent,
  };
};

// Global shared composable for cross-route page state consistency
export const useCookieConsent = createSharedComposable(_useCookieConsentInternal);
