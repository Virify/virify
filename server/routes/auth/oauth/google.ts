export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    const dbUser = await oauthDatabaseCheck(user.email);
    await setSession(event, dbUser, false);
    return sendRedirect(event, "/login?login=success");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth Error:", error);
    return sendRedirect(event, "/login");
  },
});
