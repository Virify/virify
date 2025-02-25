export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    // check if user is already loggedin
    if (user.loggedIn) {
      await replaceUserSession(event, {
        user: {
          username: user.name,
          email: user.email,
        },
        loggedIn: true,
        loggedInAt: new Date(),
        session: tokens.session,
      });
    } else {
      await setUserSession(event, {
        user: {
          username: user.name,
          email: user.email,
        },
        loggedIn: true,
        loggedInAt: new Date(),
        session: tokens.session,
      });
      await authDatabaseCheck(user.email, user.name);

    }
    return sendRedirect(event, "/login");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth Error:", error);
    return sendRedirect(event, "/login");
  },
});
