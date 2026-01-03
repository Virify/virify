/**
 * Verify Cloudflare Turnstile token
 * @param token - The Turnstile token from the client
 * @param remoteIp - The client's IP address
 * @returns Promise<boolean> - Whether the token is valid
 */
export async function verifyTurnstileToken(token: string, remoteIp: string): Promise<boolean> {
  const config = useRuntimeConfig();

  const formData = new FormData();
  formData.append("secret", config.CF_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const outcome = await response.json();
    return outcome.success;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
