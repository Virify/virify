import * as z from "zod";
import { sendWaitingListConfirmation } from "~~/layers/email/server/email/send-waiting-list-confirmation";

const waitingListSchema = z.object({
  email: z.email(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  
  try {
    const { email } = await readValidatedBody(event, waitingListSchema.parse);
    

    // Check if email already exists
    const existingEntry = await waitingListPrisma.waitingList.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return {
        success: true,
        message: "You're already on the waiting list! We will notify you as soon as we are ready to launch early access.",
        alreadyExists: true,
      };
    }

    // Create new waiting list entry
    const newEntry = await waitingListPrisma.waitingList.create({
      data: {
        email,
      },
    });

    // Get total signup count
    const totalSignups = await waitingListPrisma.waitingList.count();

    // Send Slack notification
    try {
      await notifyWaitingListSignup(totalSignups);
    } catch (slackError) {
      console.error("Failed to send Slack notification:", slackError);
      // Don't fail the request if Slack notification fails
    }

    // Send confirmation email
    try {
      await sendWaitingListConfirmation(email);
    } catch (emailError) {
      console.error("Failed to send waiting list confirmation email:", emailError);
      // Don't fail the request if email fails, user is still on the list
    }

    return {
      success: true,
      message: "You have been added to the waiting list! We will notify you as soon as we are ready to launch early access.",
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
