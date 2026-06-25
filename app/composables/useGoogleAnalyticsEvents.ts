type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export function useGoogleAnalyticsEvents() {
  const track = useTrackEvent;

  function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
    if (!import.meta.client) return;

    try {
      track(eventName, params);
    } catch (error) {
      console.warn(`[analytics] Failed to track GA event "${eventName}"`, error);
    }
  }

  function trackEnquiryButtonClick(params: {
    listingId: number | string;
    listingType: "sale" | "rent";
    location: string;
    authenticated: boolean;
  }) {
    trackEvent("enquiry_button_click", {
      event_category: "engagement",
      listing_id: params.listingId,
      listing_type: params.listingType,
      button_location: params.location,
      authenticated: params.authenticated,
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
