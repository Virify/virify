export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    // check if user is already loggedin
    const dbUser = await authDatabaseCheck(user.email, user.name);
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
    console.error("Google OAuth Error:", error);
    return sendRedirect(event, "/login");
  },
});
