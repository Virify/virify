// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderToString } from "vue/server-renderer";
import { h } from "vue";
import contactEnquiry from "../components/email/templates/contact-enquiry.vue";
import supportRequest from "../components/email/templates/support-request.vue";
import enquiryNotification from "../components/email/templates/enquiry-notification.vue";

// ──────────────────────────────────────────────────────────────────────────────
// contact-enquiry.vue
// ──────────────────────────────────────────────────────────────────────────────

describe("Contact Enquiry Email Template", () => {
  const defaultProps = {
    name: "Jane Smith",
    email: "jane@example.com",
    telephone: "07700900000",
    enquiry: "I have a question about your property listings.",
  };

  it("renders the submitter name", async () => {
    const html = await renderToString(h(contactEnquiry, defaultProps));
    expect(html).toContain("Jane Smith");
  });

  it("renders the submitter email", async () => {
    const html = await renderToString(h(contactEnquiry, defaultProps));
    expect(html).toContain("jane@example.com");
  });

  it("renders the enquiry text", async () => {
    const html = await renderToString(h(contactEnquiry, defaultProps));
    expect(html).toContain("I have a question about your property listings.");
  });

  it("renders the telephone number", async () => {
    const html = await renderToString(h(contactEnquiry, defaultProps));
    expect(html).toContain("07700900000");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// support-request.vue
// ──────────────────────────────────────────────────────────────────────────────

describe("Support Request Email Template", () => {
  const defaultProps = {
    name: "John Doe",
    email: "john@example.com",
    type: "bug",
    details: "The login button is not working on mobile.",
  };

  it("renders the submitter name", async () => {
    const html = await renderToString(h(supportRequest, defaultProps));
    expect(html).toContain("John Doe");
  });

  it("renders the submitter email", async () => {
    const html = await renderToString(h(supportRequest, defaultProps));
    expect(html).toContain("john@example.com");
  });

  it("renders the support type", async () => {
    const html = await renderToString(h(supportRequest, defaultProps));
    expect(html).toContain("bug");
  });

  it("renders the details text", async () => {
    const html = await renderToString(h(supportRequest, defaultProps));
    expect(html).toContain("The login button is not working on mobile.");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// enquiry-notification.vue
// ──────────────────────────────────────────────────────────────────────────────

describe("Enquiry Notification Email Template", () => {
  const baseProps = {
    senderName: "Alice Buyer",
    message: "Hi, I am interested in your property.",
    conversationUrl: "https://virify.co.uk/enquiries/42",
  };

  it("renders the sender name in a new-enquiry context", async () => {
    const html = await renderToString(h(enquiryNotification, { ...baseProps, isReply: false }));
    expect(html).toContain("Alice Buyer");
  });

  it("renders the conversation URL", async () => {
    const html = await renderToString(h(enquiryNotification, baseProps));
    expect(html).toContain("https://virify.co.uk/enquiries/42");
  });

  it("renders the message body", async () => {
    const html = await renderToString(h(enquiryNotification, baseProps));
    expect(html).toContain("Hi, I am interested in your property.");
  });

  it("shows reply wording when isReply is true", async () => {
    const html = await renderToString(h(enquiryNotification, { ...baseProps, isReply: true }));
    expect(html).toContain("replied");
  });

  it("shows new enquiry wording when isReply is false", async () => {
    const html = await renderToString(h(enquiryNotification, { ...baseProps, isReply: false }));
    expect(html).toContain("New Enquiry");
  });

  it("renders listing address when provided", async () => {
    const html = await renderToString(
      h(enquiryNotification, { ...baseProps, listingAddress: "10 Downing Street, London" })
    );
    expect(html).toContain("10 Downing Street, London");
  });
});

