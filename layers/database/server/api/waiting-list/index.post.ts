import * as z from "zod";
import { sendWaitingListConfirmation } from "~~/layers/email/server/email/send-waiting-list-confirmation";

const waitingListSchema = z.object({
  email: z.email(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  
  try {
    const body = await readValidatedBody(event, waitingListSchema.parse);
    

    // Check if email already exists
    const existingEntry = await waitingListPrisma.waitingList.findUnique({
      where: { email: body.email },
    });

    if (existingEntry) {
      return {
        success: true,
        message: "You're already on the waiting list!",
        alreadyExists: true,
      };
    }

    // Create new waiting list entry
    const newEntry = await waitingListPrisma.waitingList.create({
      data: {
        email: body.email,
      },
    });

    // Send confirmation email
    try {
      await sendWaitingListConfirmation(body.email);
    } catch (emailError) {
      console.error("Failed to send waiting list confirmation email:", emailError);
      // Don't fail the request if email fails, user is still on the list
    }

    return {
      success: true,
      message: "Successfully added to waiting list",
      data: {
        id: newEntry.id,
        email: newEntry.email,
        createdAt: newEntry.createdAt,
      },
    };
  } catch (error: any) {
    console.error("Waiting list signup error:", error);
    
    return errorResponse(error, event);
  }
});
