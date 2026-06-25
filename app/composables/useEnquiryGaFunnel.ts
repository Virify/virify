type EnquiryGaFunnelEvent =
  | "login_modal_closed"
  | "signup_modal_closed"
  | "otp_modal_closed"
  | "login_success"
  | "signup_submitted"
  | "signup_verified";

interface EnquiryGaFunnelContext {
  clickId: string;
  listingId: number | string;
  listingType: "sale" | "rent";
  location: string;
  authenticated: boolean;
  createdAt: number;
}

const STORAGE_KEY = "virify-enquiry-ga-funnel";
const MAX_AGE_MS = 30 * 60 * 1000;

export function useEnquiryGaFunnel() {
  const context = useState<EnquiryGaFunnelContext | null>(
    "enquiry-ga-funnel-context",
    () => null,
  );
  const gaEvents = useGoogleAnalyticsEvents();

  function clearContext() {
    context.value = null;
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function getContext() {
    if (!import.meta.client) return context.value;

    if (context.value && Date.now() - context.value.createdAt <= MAX_AGE_MS) {
      return context.value;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as EnquiryGaFunnelContext;
      if (!parsed?.clickId || Date.now() - parsed.createdAt > MAX_AGE_MS) {
        clearContext();
        return null;
      }

      context.value = parsed;
      return parsed;
    } catch {
      return null;
    }
  }

  function setContext(data: Omit<EnquiryGaFunnelContext, "createdAt">) {
    if (!import.meta.client) return;

    const value: EnquiryGaFunnelContext = {
      ...data,
      createdAt: Date.now(),
    };

    context.value = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  function trackFunnelEvent(event: EnquiryGaFunnelEvent, reason?: string) {
    const current = getContext();
    if (!current) return;

    gaEvents.trackEvent(`enquiry_${event}`, {
      event_category: "engagement",
      click_id: current.clickId,
      listing_id: current.listingId,
      listing_type: current.listingType,
      button_location: current.location,
      authenticated_at_click: current.authenticated ? "yes" : "no",
      close_reason: reason,
    });

    if (
      event === "login_modal_closed" ||
      event === "signup_modal_closed" ||
      event === "otp_modal_closed" ||
      event === "login_success" ||
      event === "signup_verified"
    ) {
      clearContext();
    }
  }

  function trackEnquirySent() {
    const current = getContext();
    if (!current) return;

    gaEvents.trackEvent("listing_enquiry_sent", {
      event_category: "engagement",
      click_id: current.clickId,
      listing_id: current.listingId,
      listing_type: current.listingType,
      button_location: current.location,
      authenticated_at_click: current.authenticated ? "yes" : "no",
    });

    clearContext();
  }

  return {
    context,
    getContext,
    setContext,
    clearContext,
    trackFunnelEvent,
    trackEnquirySent,
  };
}
