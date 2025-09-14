import sendSupportRequest from '../../layers/email/server/email/send-support-request';

export default defineEventHandler(async (event) => {
  try {
    // Get the request body
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.name || !body.email || !body.type || !body.details) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required: name, email, type, details'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      });
    }
    
    // Validate type
    const validTypes = ['bug', 'issue', 'feature', 'other'];
    if (!validTypes.includes(body.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid support request type'
      });
    }
    
    // Send the support request email
    await sendSupportRequest(
      body.name,
      body.email,
      body.type,
      body.details
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