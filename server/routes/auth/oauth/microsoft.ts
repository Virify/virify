export default defineOAuthMicrosoftEventHandler({
  async onSuccess(event, { user, tokens }) {
    const dbUser = await oauthDatabaseCheck(user.mail);
    // check if user is already loggedin
    await setSession(event, dbUser, false);
    return sendRedirect(event, "/login?login=success");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Microsoft OAuth Error:", error);
    return sendRedirect(event, "/login");
  },
});
