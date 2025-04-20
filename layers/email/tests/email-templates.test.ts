import { describe, it, expect } from "vitest";
import { renderToString } from "vue/server-renderer";
import { h } from "vue";
import AgentActivation from "../components/email/templates/agent-activation.vue";
import AgentDenied from "../components/email/templates/agent-denied.vue";
import AgentReview from "../components/email/templates/agent-review.vue";
import OwnerActivation from "../components/email/templates/owner-activation.vue";
import passwordReset from "../components/email/templates/password-reset.vue";
import ToAgentReview from "../components/email/templates/to-agent-review.vue";

describe("Agent Activation Email Template", () => {
  it("renders correct HTML with given props", async () => {
    const html = await renderToString(
      h(AgentActivation, {
        token: "abc123",
        baseUrl: "https://example.com",
      })
    );

    expect(html).toContain("Your Account Has Been Approved");
    expect(html).toContain("https://example.com/auth/activate-account?token=abc123");
    expect(html).toContain("Congratulations! Your account has been approved.");
    expect(html).toContain("If you did not sign up for this account");
  });
});

describe("Agent Denied Email Template", () => {
  it("renders the correct HTML with the given props", async () => {
    const html = await renderToString(
      h(AgentDenied, {
        email: "test@example.com",
        businessName: "Test Business",
        mainContact: "Jamie",
        addressLine: "123 Test St",
        city: "Test City",
        county: "Test County",
        country: "Test Country",
        postcode: "12345",
        registrationNumber: "123456789",
        baseUrl: "https://example.com",
      })
    );

    expect(html).toContain("Test Business");
    expect(html).toContain("your account has been denied");
    expect(html).toContain("123 Test St");
  });
});

describe("Agent Review Email Template", () => {
  it("renders the correct HTML with the given props", async () => {
    const html = await renderToString(
      h(AgentReview, {
        email: "test@example.com",
        businessName: "Test Business",
        mainContact: "Jamie",
        addressLine: "123 Test St",
        city: "Test City",
        county: "Test County",
        country: "Test Country",
        postcode: "12345",
        registrationNumber: "123456789",
        baseUrl: "https://example.com",
        token: "abc123",
      })
    );
    expect(html).toContain("Test Business");
    expect(html).toContain("123 Test St");
    expect(html).toContain("Virify New Estate Agent Review!");
    expect(html).toContain("https://example.com/review/abc123?approve=false");
    expect(html).toContain("https://example.com/review/abc123?approve=true");
  });
});

describe("Owner Activation Email Template", () => {
  it("renders correct HTML with given props", async () => {
    const html = await renderToString(
      h(OwnerActivation, {
        token: "abc123",
        baseUrl: "https://example.com",
        otpCode: "123456",
      })
    );
    expect(html).toContain("Activate Account");
    expect(html).toContain("https://example.com/auth/activate-account?token=abc123");
    expect(html).toContain("123456");
  });
});

describe("Password Reset Email Template", () => {
  it("renders correct HTML with given props", async () => {
    const html = await renderToString(
      h(passwordReset, {
        token: "abc123",
        baseUrl: "https://example.com",
      })
    );
    expect(html).toContain("forgtotten your password?");
    expect(html).toContain("https://example.com/password/reset/abc123");
  });
});

describe("Notify Agent of Review Email Templates", () => {
  it("renders correct HTML with given props", async () => {
    const html = await renderToString(
      h(ToAgentReview, {
        email: "test@example.com",
        businessName: "Test Business",
        mainContact: "Jamie",
        addressLine: "123 Test St",
        city: "Test City",
        county: "Test County",
        country: "Test Country",
        postcode: "12345",
        registrationNumber: "123456789",
      })
    );
    expect(html).toContain("We are currently reviewing");
    expect(html).toContain("Test Business");
    expect(html).toContain("123 Test St");
    expect(html).toContain("Test City");
  });
});
