import { prisma } from "./prisma-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OwnershipVerificationByToken {
  id: number;
  draftListingId: number;
  userId: number;
  status: string;
  reviewTokenExpiry: Date;
  docOneKey: string | null;
  docOneName: string | null;
  docTwoKey: string | null;
  docTwoName: string | null;
  createdAt: Date;
}

export interface OwnershipVerificationByDraftId {
  id: number;
  status: string;
  createdAt: Date;
  reviewedAt: Date | null;
}

export interface UpsertOwnershipSubmissionData {
  draftListingId: number;
  userId: number;
  docOneKey: string;
  docOneName: string;
  docTwoKey: string;
  docTwoName: string;
}

export interface ApplyOwnershipReviewParams {
  id: number;
  draftListingId: number;
  userId: number | null;
  action: "approve" | "deny";
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Find an ownership verification record by its review token.
 * Returns fields needed by the document proxy, review-details, and review endpoints.
 */
export async function getVerificationByToken(
  token: string,
): Promise<OwnershipVerificationByToken | null> {
  return prisma.ownershipVerification.findUnique({
    where: { reviewToken: token },
    select: {
      id: true,
      draftListingId: true,
      userId: true,
      status: true,
      reviewTokenExpiry: true,
      docOneKey: true,
      docOneName: true,
      docTwoKey: true,
      docTwoName: true,
      createdAt: true,
    },
  });
}

/**
 * Find an ownership verification record by draft listing ID.
 * Returns the status summary used by the status and submit endpoints.
 */
export async function getVerificationByDraftId(
  draftListingId: number,
): Promise<OwnershipVerificationByDraftId | null> {
  return prisma.ownershipVerification.findUnique({
    where: { draftListingId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create or update an ownership verification submission.
 * Re-submissions on a previously DENIED record are allowed; PENDING and APPROVED are blocked upstream.
 */
export async function upsertOwnershipSubmission(data: UpsertOwnershipSubmissionData) {
  return prisma.ownershipVerification.upsert({
    where: { draftListingId: data.draftListingId },
    update: {
      docOneKey: data.docOneKey,
      docOneName: data.docOneName,
      docTwoKey: data.docTwoKey,
      docTwoName: data.docTwoName,
      status: "PENDING",
      reviewedAt: null,
    },
    create: {
      draftListingId: data.draftListingId,
      userId: data.userId,
      docOneKey: data.docOneKey,
      docOneName: data.docOneName,
      docTwoKey: data.docTwoKey,
      docTwoName: data.docTwoName,
    },
  });
}

/**
 * Apply an approve or deny decision to a verification record.
 * Runs in a single transaction:
 *   1. Updates the ownershipVerification status and clears doc keys (docs will be deleted from R2 separately).
 *   2. Updates the draftListing verificationLevel.
 *   3. On approval, upserts the user's Verification record to mark name + identity as confirmed.
 */
export async function applyOwnershipReview(
  params: ApplyOwnershipReviewParams,
): Promise<void> {
  const { id, draftListingId, userId, action } = params;
  const newStatus = action === "approve" ? "APPROVED" : "DENIED";
  const newVerificationLevel = action === "approve" ? "FULLY_VERIFIED" : "UNVERIFIED";

  await prisma.$transaction([
    prisma.ownershipVerification.update({
      where: { id },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
        // Clear keys — documents will be deleted from R2 after this transaction
        docOneKey: null,
        docOneName: null,
        docTwoKey: null,
        docTwoName: null,
      },
    }),
    prisma.draftListing.update({
      where: { id: draftListingId },
      data: { verificationLevel: newVerificationLevel },
    }),
    ...(action === "approve" && userId ?
      [
        prisma.verification.upsert({
          where: { userId },
          update: { name: true, identity: true },
          create: { userId, name: true, identity: true },
        }),
      ]
    : []),
  ]);
}
