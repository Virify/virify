import { describe, it, expect } from "vitest";
import { renderToString } from "vue/server-renderer";
import { h } from "vue";
import OwnerActivation from "../components/email/templates/user-activation.vue";
import passwordReset from "../components/email/templates/password-reset.vue";

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
        passwordToken: "abc123",
        otpCode: "123456",
        baseUrl: "https://example.com",
      })
    );
    expect(html).toContain("forgtotten your password?");
    expect(html).toContain("https://example.com/auth/password-reset?passwordToken=abc123");
  });
});
