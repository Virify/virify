type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export function useGoogleAnalyticsEvents() {
  const instance = useScriptGoogleAnalytics();

  function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
    if (!import.meta.client) return;

    try {
      if (instance.proxy && typeof instance.proxy.gtag === "function") {
        instance.proxy.gtag("event", eventName, params);
      } else {
        console.warn(`[analytics] GA4 proxy not ready yet for event: ${eventName}`);
      }
    } catch (error) {
      console.warn(`[analytics] Failed to track GA event "${eventName}"`, error);
    }
  }

  function trackEnquiryButtonClick(params: {
    clickId: string;
    listingId: number | string;
    listingType: "sale" | "rent";
    location: string;
    authenticated: boolean;
  }) {
    trackEvent("enquiry_button_click", {
      event_category: "engagement",
      click_id: params.clickId,
      listing_id: params.listingId,
      listing_type: params.listingType,
      button_location: params.location,
      authenticated: params.authenticated ? "yes" : "no",
    });
  }

  function trackSignup() {
    trackEvent("sign_up", {
      method: "email",
    });
  }

  function trackSignupModalClose(reason: string) {
    trackEvent("signup_modal_close", {
      event_category: "engagement",
      close_reason: reason,
    });
  }

  return {
    trackEvent,
    trackEnquiryButtonClick,
    trackSignup,
    trackSignupModalClose,
  };
}
