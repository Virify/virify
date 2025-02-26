export default defineOAuthMicrosoftEventHandler({
  async onSuccess(event, { user, tokens }) {
    const dbUser = await authDatabaseCheck(user.mail, user.displayName);
    // check if user is already loggedin
    if (user.loggedIn) {
      await replaceUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          username: dbUser.username || dbUser.email,
        },
        loggedIn: true,
        loggedInAt: new Date(),
        session: tokens.session,
      });
    } else {
      await setUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          username: dbUser.username || dbUser.email,
        },
        loggedIn: true,
        loggedInAt: new Date(),
        session: tokens.session,
      });
    }
    return sendRedirect(event, "/login?login=success");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Microsoft OAuth Error:", error);
    return sendRedirect(event, "/login");
  },
});
