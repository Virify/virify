import { render } from "@vue-email/render";
import ownershipReviewTemplate from "~~/layers/ownership/components/email/templates/ownership-review.vue";
import { sesSender } from "~~/layers/email/server/utils/ses-sender";

interface SendOwnershipReviewOptions {
  to: string;
  firstName: string | null;
  lastName: string | null;
  userEmail: string;
  draftListingId: number;
  reviewUrl: string;
}

export default async function sendOwnershipReview(
  options: SendOwnershipReviewOptions,
): Promise<void> {
  const html = await render(ownershipReviewTemplate, options);
  const displayName =
    [options.firstName, options.lastName].filter(Boolean).join(" ") ||
    options.userEmail ||
    "A user";
  const subject = `Ownership Verification Review: ${displayName} — Listing #${options.draftListingId}`;
  await sesSender(html, subject, options.to);
}
