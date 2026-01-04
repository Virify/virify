/**
 * Send a notification to Slack webhook
 */
export async function sendSlackNotification(message: string, emoji: string = ':tada:') {
  const webhookUrl = process.env.WAITING_LIST_WEBHOOK;
  
  if (!webhookUrl) {
    console.warn('WAITING_LIST_WEBHOOK is not set in environment variables');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `${emoji} ${message}`,
      }),
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    // Don't throw error, just log it - we don't want to fail the main operation
  }
}

/**
 * Send a waiting list signup notification to Slack
 */
export async function notifyWaitingListSignup(totalSignups: number) {
  const message = `Congrats! We just added another to the list of sign-ups. We currently have ${totalSignups} signup${totalSignups !== 1 ? 's' : ''}! 🎉`;
  await sendSlackNotification(message, ':tada:');
}
