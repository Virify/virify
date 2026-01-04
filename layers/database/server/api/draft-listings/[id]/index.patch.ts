import { z } from 'zod';

const schema = z.object({
  stepNumber: z.number().int().min(1).max(10),
});

/**
 * Mark a step as completed for a draft listing
 * This tracks which steps the user has visited/completed, regardless of whether they added data
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const draftId = getRouterParam(event, 'id');

  if (!draftId) {
    throw createError({
      statusCode: 400,
      message: 'Draft listing ID is required',
    });
  }

  try {
    const { stepNumber } = await readValidatedBody(event, schema.parse);

    // Get current draft to check ownership and existing completed steps
    const draft = await prisma.draftListing.findUnique({
      where: { id: Number(draftId) },
      select: { userId: true, completedSteps: true },
    });

    if (!draft) {
      throw createError({
        statusCode: 404,
        message: 'Draft listing not found',
      });
    }

    if (draft.userId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'You do not have permission to update this draft listing',
      });
    }

    // Only add step if not already completed
    if (!draft.completedSteps.includes(stepNumber)) {
      await prisma.draftListing.update({
        where: { id: Number(draftId) },
        data: {
          completedSteps: {
            push: stepNumber,
          },
        },
      });
    }

    return {
      success: true,
      message: `Step ${stepNumber} marked as completed`,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to mark step as completed',
      cause: error,
    });
  }
});
