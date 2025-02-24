export default defineOAuthMicrosoftEventHandler({
  async onSuccess(event, { user, tokens }) {
    // check if user is already loggedin
    if (user.loggedIn) {
      await replaceUserSession(event, {
        user: {
          email: user.mail,
          username: user.displayName,
        },
        loggedIn: true,
        loggedInAt: new Date(),
        session: tokens.session,
      });
    } else {
      await setUserSession(event, {
        user: {
          email: user.mail,
          username: user.displayName,
        },
        loggedIn: true,
        loggedInAt: new Date(),
        session: tokens.session,
      });
    }
    return sendRedirect(event, "/login");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Microsoft OAuth Error:", error);
    return sendRedirect(event, "/login");
  },
});
