import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function mountCookieConsent() {
  vi.resetModules();

  const { useCookieConsent } = await import("../../../app/composables/useCookieConsent");
  let consent: ReturnType<typeof useCookieConsent> | undefined;

  const wrapper = mount(
    defineComponent({
      setup() {
        consent = useCookieConsent();
        return {};
      },
      template: "<div />",
    }),
  );

  await nextTick();

  return {
    wrapper,
    consent: consent!,
  };
}

describe("useCookieConsent", () => {
  const consentUpdate = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal("useScriptGoogleAnalytics", () => ({
      consent: {
        update: consentUpdate,
      },
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stays open when no accept or decline choice has been stored", async () => {
    const { wrapper, consent } = await mountCookieConsent();

    expect(consent.isOpen.value).toBe(true);
    expect(consent.hasInteraction.value).toBe(false);
    expect(consentUpdate).toHaveBeenLastCalledWith({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    wrapper.unmount();
  });

  it("only closes after accepting cookies", async () => {
    const { wrapper, consent } = await mountCookieConsent();

    consent.acceptCookies();

    expect(consent.isOpen.value).toBe(false);
    expect(consent.hasConsented.value).toBe(true);
    expect(consent.hasInteraction.value).toBe(true);
    expect(localStorage.getItem("virify-cookie-consent")).toBe("true");
    expect(consentUpdate).toHaveBeenLastCalledWith({
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });

    wrapper.unmount();
  });

  it("only closes after declining cookies", async () => {
    const { wrapper, consent } = await mountCookieConsent();

    consent.declineCookies();

    expect(consent.isOpen.value).toBe(false);
    expect(consent.hasConsented.value).toBe(false);
    expect(consent.hasInteraction.value).toBe(true);
    expect(localStorage.getItem("virify-cookie-consent")).toBe("false");
    expect(consentUpdate).toHaveBeenLastCalledWith({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    wrapper.unmount();
  });

  it("does not expose a writable open state that can dismiss the modal", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { wrapper, consent } = await mountCookieConsent();

    (consent.isOpen as { value: boolean }).value = false;

    expect(consent.isOpen.value).toBe(true);
    expect(localStorage.getItem("virify-cookie-consent")).toBeNull();

    warn.mockRestore();
    wrapper.unmount();
  });

  it("reopens consent after resetting stored preferences", async () => {
    const { wrapper, consent } = await mountCookieConsent();

    consent.acceptCookies();
    consent.resetConsent();

    expect(consent.isOpen.value).toBe(true);
    expect(consent.hasConsented.value).toBe(false);
    expect(consent.hasInteraction.value).toBe(false);
    expect(localStorage.getItem("virify-cookie-consent")).toBeNull();

    wrapper.unmount();
  });

  it("fails open when stored consent cannot be read", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    const { wrapper, consent } = await mountCookieConsent();

    expect(consent.isOpen.value).toBe(true);
    expect(consent.hasInteraction.value).toBe(false);

    warn.mockRestore();
    wrapper.unmount();
  });
});
