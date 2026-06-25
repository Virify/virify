/**
 * Composable for fire-and-forget analytics tracking via sendBeacon
 *
 * This composable handles all OUTBOUND analytics events - tracking user interactions
 * Uses navigator.sendBeacon for lightweight, non-blocking requests
 *
 * Separation of concerns:
 * - useAnalyticsTracking: POST events (fire-and-forget)
 * - useAnalytics: GET/fetch analytics data for display
 *
 * Types are defined in shared/types/analytics.ts
 */
import { nanoid } from "nanoid";
import { createSharedComposable } from "@vueuse/core";

/**
 * Analytics tracking composable
 * Provides fire-and-forget tracking methods using sendBeacon
 */
export const useAnalyticsTracking = createSharedComposable(() => {
  const {
    trackEvent: trackGoogleAnalyticsEvent,
  } = useGoogleAnalyticsEvents();

  // Persistent session ID for tracking
  const sessionId = useState("analytics-session-id", () => nanoid());

  // Track view history to prevent duplicate views
  const viewHistory = useState<Record<string, number>>(
    "analytics-view-history",
    () => ({}),
  );

  // Track impressions that have been sent to avoid duplicates
  const sentImpressions = useState<Set<number>>(
    "analytics-sent-impressions",
    () => new Set(),
  );

  /**
   * Get base payload with common fields
   * Returns null sessionId if user has declined consent (anonymous tracking)
   */
  const getBasePayload = (): TrackingBasePayload => {
    const { hasConsented } = useCookieConsent();

    return {
      sessionId: hasConsented.value ? sessionId.value : null,
      timestamp: Date.now(),
      userAgent: import.meta.client ? navigator.userAgent : undefined,
      referrer: import.meta.client ? document.referrer : undefined,
    };
  };

  /**
   * Detect traffic source from referrer
   */
  const detectSource = (): TrafficSourceType => {
    if (!import.meta.client) return "direct";

    const referrer = document.referrer;
    if (!referrer) return "direct";

    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    // Social platforms
    if (
      hostname.includes("facebook") ||
      hostname.includes("twitter") ||
      hostname.includes("instagram") ||
      hostname.includes("linkedin") ||
      hostname.includes("tiktok") ||
      hostname.includes("pinterest")
    ) {
      return "social";
    }

    // Search engines
    if (
      hostname.includes("google") ||
      hostname.includes("bing") ||
      hostname.includes("yahoo") ||
      hostname.includes("duckduckgo")
    ) {
      return "search";
    }

    // Email services
    if (
      hostname.includes("mail") ||
      hostname.includes("outlook") ||
      hostname.includes("gmail")
    ) {
      return "email";
    }

    // Check if it's our own domain (internal navigation)
    if (import.meta.client && hostname === window.location.hostname) {
      return "direct";
    }

    return "referral";
  };

  /**
   * Send tracking event via sendBeacon
   * Fire-and-forget - doesn't wait for response
   * Supports both consented (with sessionId) and anonymous (without sessionId) tracking
   */
  const sendBeaconEvent = <T extends object>(
    endpoint: string,
    payload: T,
  ): boolean => {
    if (!import.meta.client || typeof navigator.sendBeacon !== "function") {
      console.warn(`[analytics] sendBeacon not available for ${endpoint}`);
      return false;
    }

    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const accepted = navigator.sendBeacon(endpoint, blob);
      if (!accepted) {
        console.warn(
          `[analytics] sendBeacon rejected by browser for ${endpoint} (queue full?)`,
        );
      }
      return accepted;
    } catch (error) {
      console.error(`Failed to send beacon to ${endpoint}:`, error);
      return false;
    }
  };

  /**
   * Track a listing view (user visits listing detail page)
   * Debounced - only counts once per 30 minutes per listing
   */
  const trackView = (
    listingId: number | string,
    options?: { source?: TrafficSourceType },
  ) => {
    if (!import.meta.client) return;

    const listingKey = `listing-${listingId}`;
    const now = Date.now();
    const DEBOUNCE_MS = 30 * 60 * 1000; // 30 minutes

    // Check if we've tracked this listing recently
    if (
      viewHistory.value[listingKey] &&
      now - viewHistory.value[listingKey] < DEBOUNCE_MS
    ) {
      return;
    }

    // Update view history
    viewHistory.value[listingKey] = now;

    // Persist to localStorage for cross-session deduplication
    try {
      localStorage.setItem(
        "virify-view-history",
        JSON.stringify(viewHistory.value),
      );
    } catch (e) {
      // localStorage not available
    }

    const payload: TrackingListingPayload = {
      ...getBasePayload(),
      listingId,
      source: options?.source || detectSource(),
    };

    trackGoogleAnalyticsEvent("listing_view", {
      event_category: "listing",
      listing_id: listingId,
      source: payload.source,
    });
    sendBeaconEvent("/api/analytics/track/view", payload);
  };

  /**
   * Track listing impressions (listings appearing in search results)
   * Batched to reduce requests - call with array of listing IDs
   */
  const trackImpressions = (
    listingIds: number[],
    options?: { source?: string; searchQuery?: string },
  ) => {
    if (!import.meta.client || listingIds.length === 0) return;

    // Filter out already-sent impressions (this session)
    const newImpressions = listingIds.filter(
      (id) => !sentImpressions.value.has(id),
    );
    if (newImpressions.length === 0) return;

    // Mark as sent
    newImpressions.forEach((id) => sentImpressions.value.add(id));

    // Send in chunks of 100 to respect the API limit
    const CHUNK_SIZE = 100;
    for (let i = 0; i < newImpressions.length; i += CHUNK_SIZE) {
      const chunk = newImpressions.slice(i, i + CHUNK_SIZE);
      const payload: TrackingImpressionBatchPayload = {
        ...getBasePayload(),
        listingIds: chunk,
        source: options?.source,
        searchQuery: options?.searchQuery,
      };
      trackGoogleAnalyticsEvent("listing_impressions", {
        event_category: "listing",
        impression_count: chunk.length,
        source: options?.source,
        search_query: options?.searchQuery,
      });
      sendBeaconEvent("/api/analytics/track/impressions", payload);
    }
  };

  /**
   * Reset impression tracking (call when search changes)
   */
  const resetImpressionTracking = () => {
    sentImpressions.value.clear();
  };

  /**
   * Track listing click (user clicks a listing card)
   */
  const trackClick = (
    listingId: number | string,
    options?: { position?: number; source?: string },
  ) => {
    if (!import.meta.client) return;

    const payload: TrackingListingPayload = {
      ...getBasePayload(),
      listingId,
      source: detectSource(),
      position: options?.position,
    };

    trackGoogleAnalyticsEvent("listing_click", {
      event_category: "listing",
      listing_id: listingId,
      source: payload.source,
      position: options?.position,
    });
    sendBeaconEvent("/api/analytics/track/click", payload);
  };

  /**
   * Track favourite action
   */
  const trackFavourite = (
    listingId: number | string,
    action: "add" | "remove",
  ) => {
    if (!import.meta.client) return;

    const payload: TrackingFavouritePayload = {
      ...getBasePayload(),
      listingId,
      action,
    };

    trackGoogleAnalyticsEvent("listing_favourite", {
      event_category: "listing",
      listing_id: listingId,
      action,
    });
    sendBeaconEvent("/api/analytics/track/favourite", payload);
  };

  /**
   * Track enquiry sent
   */
  const trackEnquiry = (listingId: number | string) => {
    if (!import.meta.client) return;

    const payload: TrackingListingPayload = {
      ...getBasePayload(),
      listingId,
      source: detectSource(),
    };

    trackGoogleAnalyticsEvent("listing_enquiry_sent", {
      event_category: "listing",
      listing_id: listingId,
      source: payload.source,
    });
    sendBeaconEvent("/api/analytics/track/enquiry", payload);
  };

  /**
   * Track share action
   */
  const trackShare = (listingId: number | string, platform: string) => {
    if (!import.meta.client) return;

    const payload: TrackingSharePayload = {
      ...getBasePayload(),
      listingId,
      platform,
    };

    trackGoogleAnalyticsEvent("listing_share", {
      event_category: "listing",
      listing_id: listingId,
      platform,
    });
    sendBeaconEvent("/api/analytics/track/share", payload);
  };

  /**
   * Track search performed
   */
  const trackSearch = (params: {
    listingType: string;
    query: string;
    location: GeocodingFeature;
    radius: number;
    resultCount: number;
    searchType?: "ai" | "traditional";
    filters?: Record<string, unknown>;
    usedTerms?: string[];
    ignoredTerms?: string[];
  }) => {
    if (!import.meta.client) return;

    // Reset impression tracking for new search
    resetImpressionTracking();

    const payload: TrackingSearchPayload = {
      ...getBasePayload(),
      listingType: params.listingType,
      query: params.query,
      location: {
        id: params.location.id || "",
        placeName: params.location.place_name_en || params.location.place_name,
        text: params.location.text,
        lat: params.location.geometry.coordinates[1],
        lon: params.location.geometry.coordinates[0],
      },
      radius: params.radius,
      resultCount: params.resultCount,
      searchType: params.searchType ?? "ai",
      filters: params.filters,
      usedTerms: params.usedTerms,
      ignoredTerms: params.ignoredTerms,
    };

    sendBeaconEvent("/api/analytics/search", payload);
    trackGoogleAnalyticsEvent("search", {
      event_category: "search",
      search_term: params.query,
      listing_type: params.listingType,
      search_type: payload.searchType,
      location: payload.location.placeName,
      radius: params.radius,
      result_count: params.resultCount,
      used_terms_count: params.usedTerms?.length ?? 0,
      ignored_terms_count: params.ignoredTerms?.length ?? 0,
    });
    console.log(
      "[analytics] trackSearch beacon sent, payload:",
      JSON.stringify(payload),
    );
  };

  /**
   * Track mortgage calculation
   */
  const trackMortgageCalc = (data: {
    listingId?: string | null;
    propertyPrice: number;
    deposit: number;
    termYears: number;
    buyerType: string;
    customRate?: number | null;
    loanAmount: number;
    ltv: number;
    ltvBracket: string;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    rateUsed: number;
    rateType: string;
    usedDefaultRates: boolean;
    usedCustomRate: boolean;
  }) => {
    if (!import.meta.client) return;

    const payload: TrackingMortgageCalcPayload = {
      ...getBasePayload(),
      ...data,
    };

    trackGoogleAnalyticsEvent("mortgage_calculation", {
      event_category: "mortgage",
      listing_id: data.listingId,
      property_price: data.propertyPrice,
      deposit: data.deposit,
      loan_amount: data.loanAmount,
      ltv: data.ltv,
      ltv_bracket: data.ltvBracket,
      buyer_type: data.buyerType,
      rate_type: data.rateType,
      used_custom_rate: data.usedCustomRate,
    });
    sendBeaconEvent("/api/analytics/mortgage/track", payload);
  };

  // Initialize view history from localStorage on client
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem("virify-view-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean up entries older than 30 minutes
        const now = Date.now();
        const DEBOUNCE_MS = 30 * 60 * 1000;
        for (const [key, time] of Object.entries(parsed)) {
          if (now - (time as number) < DEBOUNCE_MS) {
            viewHistory.value[key] = time as number;
          }
        }
      }
    } catch (e) {
      // localStorage not available
    }
  }

  return {
    // Session management
    sessionId,

    // Listing events
    trackView,
    trackImpressions,
    trackClick,
    trackFavourite,
    trackEnquiry,
    trackShare,

    // Search events
    trackSearch,
    resetImpressionTracking,

    // Utility events
    trackMortgageCalc,

    // Utilities
    detectSource,
  };
});
