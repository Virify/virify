export default defineEventHandler(async (event) => {
  // get username and password from form data
  const { email, password } = await readBody(event);
  try {
    // find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });
    // verify password
    const matchedPassword = await verifyPassword(user?.password as string, password as string);
    if (matchedPassword) {
      // if password is correct, set user session
      await setUserSession(event, {
        user: {
          username: user?.username as string,
          email: user?.email as string,
        },
        loggedIn: true,
        loggedInAt: new Date(),
      });
      // return success status
      return {
        status: 200,
      };
    }
  } catch (error) {
    return {
      status: 401,
      body: {
        session: await getUserSession(event),
      },
    };
  }
});
