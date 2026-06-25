export type PageViewSource = "search" | "direct" | "social" | "email" | "referral";

export function detectPageViewSource(referrer?: string | null): PageViewSource {
  if (!referrer) return "direct";

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();

    if (
      hostname.includes("google") ||
      hostname.includes("bing") ||
      hostname.includes("yahoo") ||
      hostname.includes("duckduckgo")
    ) {
      return "search";
    }

    if (
      hostname.includes("facebook") ||
      hostname.includes("twitter") ||
      hostname.includes("x.com") ||
      hostname.includes("instagram") ||
      hostname.includes("linkedin") ||
      hostname.includes("tiktok") ||
      hostname.includes("pinterest")
    ) {
      return "social";
    }

    if (
      hostname.includes("mail") ||
      hostname.includes("outlook") ||
      hostname.includes("gmail")
    ) {
      return "email";
    }

    return "referral";
  } catch {
    return "direct";
  }
}

export function getClientIp(event: Parameters<typeof getHeader>[0]) {
  return (
    getHeader(event, "x-forwarded-for")?.split(",")[0]?.trim() ||
    getHeader(event, "x-real-ip") ||
    null
  );
}
