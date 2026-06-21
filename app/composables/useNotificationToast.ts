import type { NotificationType } from "~~/shared/types/notifications";

/**
 * Maps notification types to their toast presentation (colour + icon).
 * Add new types here as the platform grows.
 */
export function getNotificationToastStyle(type: NotificationType | string | undefined): {
  color: "success" | "error" | "warning" | "secondary";
  icon: string;
} {
  switch (type) {
    case "OWNERSHIP_VERIFIED":
      return { color: "success", icon: "i-lucide-shield-check" };
    case "OWNERSHIP_DENIED":
      return { color: "error", icon: "i-lucide-shield-x" };
    case "VIEWING_REQUEST":
    case "VIEWING_ACCEPTED":
    case "VIEWING_RESCHEDULED":
    case "VIEWING_CANCELLED":
    case "VIEWING_REJECTED":
      return { color: "secondary", icon: "i-lucide-calendar-check" };
    case "NEW_MESSAGE":
    case "NEW_ENQUIRY":
    case "ENQUIRY_REPLY":
    default:
      return { color: "secondary", icon: "i-lucide-message-circle" };
  }
}

/**
 * Maps a viewing notification type to its dashboard tab query param.
 */
export function getViewingTab(type: string): string {
  switch (type) {
    case "VIEWING_REQUEST":
      return "requested";
    case "VIEWING_RESCHEDULED":
      return "rescheduled";
    case "VIEWING_ACCEPTED":
      return "confirmed";
    default:
      return "all";
  }
}
