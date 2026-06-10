import { render } from "@vue-email/render";
import ownershipResultTemplate from "~~/layers/ownership/components/email/templates/ownership-result.vue";
import { sesSender } from "~~/layers/email/server/utils/ses-sender";

export interface SendOwnershipResultOptions {
  /** Email address of the listing owner */
  to: string;
  /** Whether the verification was approved (true) or denied (false) */
  approved: boolean;
  /** The draft listing ID for context */
  draftListingId: number;
  /** Base URL used to build the dashboard link */
  baseUrl: string;
}

/**
 * Sends an ownership verification result email to the listing owner.
 * Only call this when the owner is offline — online users receive a WS toast instead.
 */
export async function sendOwnershipResultEmail(
  options: SendOwnershipResultOptions,
): Promise<void> {
  const { to, approved, draftListingId, baseUrl } = options;

  const html = await render(ownershipResultTemplate, {
    approved,
    draftListingId,
    dashboardUrl: `${baseUrl}/dashboard`,
  });

  const subject =
    approved ?
      `Ownership verified for listing #${draftListingId} — Virify`
    : `Ownership documents could not be verified — Virify`;

  await sesSender(html, subject, to);
}
