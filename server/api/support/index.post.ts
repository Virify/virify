import sendSupportRequest from '../../../layers/email/server/email/send-support-request';
import * as z from 'zod';

const supportSchemaWithToken = supportSchema.extend({
  turnstileToken: z.string().min(1, 'Turnstile token is required'),
});


export default defineEventHandler(async (event) => {
  try {
    // Get the request body
    const { name, email, subject, details, turnstileToken } = await readValidatedBody(event, supportSchemaWithToken.parse);
    
    // Verify Turnstile token
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || "";
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);
    
    if (!isValidToken) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Bot verification failed. Please try again.'
      });
    }

    // Validate type
    const validTypes = ['bug', 'issue', 'feature', 'other'];
    if (!validTypes.includes(subject)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid support request type'
      });
    }
    
    // Send the support request email
    await sendSupportRequest(
      name,
      email,
      subject,
      details
    );
    
    return {
      success: true,
      message: 'Support request sent successfully'
    };
    
  } catch (error) {
    console.error('Support request error:', error);
    
    // If it's already a proper error with statusCode, throw it as is
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }
    
    // Otherwise, throw a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send support request'
    });
  }
});