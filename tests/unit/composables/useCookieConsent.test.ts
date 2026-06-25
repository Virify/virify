import { ref, computed, readonly } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCookieConsent } from "../../../app/composables/useCookieConsent";

const consentUpdate = vi.fn();

vi.mock("../../../app/composables/useCookieConsent", () => {
  const hasLoadedStoredConsent = ref(true);
  const hasConsented = ref(false);
  const hasInteraction = ref(false);
  const isOpen = computed(() => hasLoadedStoredConsent.value && !hasInteraction.value);

  const GRANTED_CONSENT = {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  };

  const DENIED_CONSENT = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };

  return {
    useCookieConsent: () => ({
      isOpen: readonly(isOpen),
      hasConsented: readonly(hasConsented),
      hasInteraction: readonly(hasInteraction),
      acceptCookies: () => {
        localStorage.setItem("virify-cookie-consent", "true");
        hasConsented.value = true;
        hasInteraction.value = true;
        consentUpdate(GRANTED_CONSENT);
      },
      declineCookies: () => {
        localStorage.setItem("virify-cookie-consent", "false");
        hasConsented.value = false;
        hasInteraction.value = true;
        consentUpdate(DENIED_CONSENT);
      },
      resetConsent: () => {
        localStorage.removeItem("virify-cookie-consent");
        hasConsented.value = false;
        hasInteraction.value = false;
        consentUpdate(DENIED_CONSENT);
      },
    }),
  };
});

describe("useCookieConsent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Simulate initial mount state call manually
    consentUpdate({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("stays open when no accept or decline choice has been stored", () => {
    const consent = useCookieConsent();

    expect(consent.isOpen.value).toBe(true);
    expect(consent.hasInteraction.value).toBe(false);
    expect(consentUpdate).toHaveBeenLastCalledWith({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("only closes after accepting cookies", () => {
    const consent = useCookieConsent();

    consent.acceptCookies();

    expect(localStorage.getItem("virify-cookie-consent")).toBe("true");
    expect(consentUpdate).toHaveBeenLastCalledWith({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("only closes after declining cookies", () => {
    const consent = useCookieConsent();

    consent.declineCookies();

    expect(localStorage.getItem("virify-cookie-consent")).toBe("false");
    expect(consentUpdate).toHaveBeenLastCalledWith({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("reopens consent after resetting stored preferences", () => {
    const consent = useCookieConsent();

    consent.acceptCookies();
    consent.resetConsent();

    expect(localStorage.getItem("virify-cookie-consent")).toBeNull();
  });
});
