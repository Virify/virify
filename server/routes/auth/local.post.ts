// TODO: Change the route of this maybe, should be one for signup and one for login
export default defineEventHandler(async (event) => {
 const { email, username, password } = await readBody(event)
  const hashedPassword = await hashPassword(password as string)
  const user = await authDatabaseCheck(email as string, username as string, hashedPassword);
  try {
    await setUserSession(event, {
      // User data
      user: {
        username: user.username,
        email: user.email,
      },
      // Any extra fields for the session data
      loggedInAt: new Date()
    });
  
  } catch(err) {
    console.log(err)
  }
  
  return {
    status: 201,
    body: JSON.stringify({ message: "User created" }),
  };

});