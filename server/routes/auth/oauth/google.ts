/**
 * Defines the OAuth event handler for Google.
 */
export default defineOAuthGoogleEventHandler({
  /**
   * Handles the successful OAuth login.
   * @param event - The H3 event object.
   * @param user - The user object returned from the OAuth provider.
   * @param tokens - The tokens returned from the OAuth provider.
   * @returns A Promise that resolves to a redirect response.
   */
  async onSuccess(event, { user, tokens }) {
    return handleOAuthSuccess(event, user.email);
  },
  /**
   * Handles OAuth login errors.
   * @param event - The H3 event object.
   * @param error - The error object.
   * @returns A redirect response with the error message.
   */
  onError(event, error) {
    return handleOAuthError(event, error);
  },
});
